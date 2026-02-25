import { useState, useCallback, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { compressImage, STORAGE_CACHE_OPTIONS } from '../../lib/utils';

interface ImageRecord {
  table: string;
  column: string;
  id: string;
  url: string;
  folder: string;
  fullMaxWidth: number;
  thumbMaxWidth: number;
}

type JobStatus = 'idle' | 'running' | 'done';

export default function GenerateThumbnails() {
  const [status, setStatus] = useState<JobStatus>('idle');
  const [log, setLog] = useState<string[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const logRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLog((prev) => [...prev, msg]);
    // Auto-scroll to bottom
    requestAnimationFrame(() => {
      logRef.current?.scrollTo(0, logRef.current.scrollHeight);
    });
  };

  const collectRecords = async (): Promise<ImageRecord[]> => {
    const records: ImageRecord[] = [];

    const [products, heroSlides, gridImages, welcomeTiles, aboutGallery, testimonials] =
      await Promise.all([
        supabase.from('products').select('id, image_url'),
        supabase.from('homepage_hero_slides').select('id, image_url'),
        supabase.from('homepage_grid_images').select('id, image_url'),
        supabase.from('welcome_tiles').select('id, image_url'),
        supabase.from('about_gallery').select('id, image_url'),
        supabase.from('testimonials').select('id, customer_photo_url'),
      ]);

    products.data?.forEach((p) => {
      if (p.image_url) records.push({ table: 'products', column: 'image_url', id: p.id, url: p.image_url, folder: 'products', fullMaxWidth: 1200, thumbMaxWidth: 400 });
    });
    heroSlides.data?.forEach((s) => {
      if (s.image_url) records.push({ table: 'homepage_hero_slides', column: 'image_url', id: s.id, url: s.image_url, folder: 'homepage', fullMaxWidth: 1600, thumbMaxWidth: 400 });
    });
    gridImages.data?.forEach((g) => {
      if (g.image_url) records.push({ table: 'homepage_grid_images', column: 'image_url', id: g.id, url: g.image_url, folder: 'homepage', fullMaxWidth: 1200, thumbMaxWidth: 400 });
    });
    welcomeTiles.data?.forEach((w) => {
      if (w.image_url) records.push({ table: 'welcome_tiles', column: 'image_url', id: w.id, url: w.image_url, folder: 'welcome-tiles', fullMaxWidth: 600, thumbMaxWidth: 300 });
    });
    aboutGallery.data?.forEach((a) => {
      if (a.image_url) records.push({ table: 'about_gallery', column: 'image_url', id: a.id, url: a.image_url, folder: 'about-gallery', fullMaxWidth: 1200, thumbMaxWidth: 400 });
    });
    testimonials.data?.forEach((t) => {
      if (t.customer_photo_url) records.push({ table: 'testimonials', column: 'customer_photo_url', id: t.id, url: t.customer_photo_url, folder: 'testimonials', fullMaxWidth: 400, thumbMaxWidth: 200 });
    });

    return records;
  };

  const run = useCallback(async () => {
    setStatus('running');
    setLog([]);

    addLog('Fetching image URLs from database...');
    const records = await collectRecords();
    addLog(`Found ${records.length} images to process.\n`);
    setProgress({ current: 0, total: records.length });

    let converted = 0;
    let thumbsCreated = 0;
    let skipped = 0;
    let failed = 0;

    for (let i = 0; i < records.length; i++) {
      const rec = records[i];
      setProgress({ current: i + 1, total: records.length });

      try {
        // Extract storage path from full URL
        const match = rec.url.match(/\/product-images\/(.+)$/);
        if (!match) {
          addLog(`[SKIP] ${rec.table}/${rec.id} — not a storage URL`);
          skipped++;
          continue;
        }

        const originalPath = match[1];
        const fileName = originalPath.split('/').pop()!;
        const folderPath = originalPath.substring(0, originalPath.length - fileName.length - 1);
        const isAlreadyWebp = fileName.endsWith('.webp');

        // Fetch the original image
        const response = await fetch(rec.url);
        if (!response.ok) {
          addLog(`[FAIL] ${rec.table}/${rec.id} — fetch failed (${response.status})`);
          failed++;
          continue;
        }

        const blob = await response.blob();
        const file = new File([blob], fileName, { type: blob.type });
        const originalSize = file.size;

        // --- STEP 1: Convert full-size to WebP if it's not already ---
        if (!isAlreadyWebp) {
          const compressed = await compressImage(file, rec.fullMaxWidth, 0.8);
          const webpFileName = fileName.replace(/\.\w+$/, '.webp');
          const newPath = `${folderPath}/${webpFileName}`;

          const { error: uploadErr } = await supabase.storage
            .from('product-images')
            .upload(newPath, compressed, STORAGE_CACHE_OPTIONS);

          if (uploadErr) {
            addLog(`[FAIL] ${rec.table}/${rec.id} — WebP upload: ${uploadErr.message}`);
            failed++;
            continue;
          }

          // Get new public URL
          const { data: { publicUrl: newUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(newPath);

          // Update the DB record to point to the new WebP
          const { error: updateErr } = await supabase
            .from(rec.table)
            .update({ [rec.column]: newUrl })
            .eq('id', rec.id);

          if (updateErr) {
            addLog(`[FAIL] ${rec.table}/${rec.id} — DB update: ${updateErr.message}`);
            failed++;
            continue;
          }

          // Delete old JPEG/PNG file
          await supabase.storage.from('product-images').remove([originalPath]);

          const savings = Math.round((1 - compressed.size / originalSize) * 100);
          addLog(`[CONVERTED] ${rec.table}/${rec.id} — ${fileName} → ${webpFileName} (${savings}% smaller)`);
          converted++;

          // Update for thumbnail step
          rec.url = newUrl;
          Object.assign(rec, { _webpFileName: webpFileName, _folderPath: folderPath });
        } else {
          addLog(`[SKIP] ${rec.table}/${rec.id} — already WebP`);
        }

        // --- STEP 2: Create thumbnail ---
        const currentFileName = rec.url.match(/\/product-images\/(.+)$/)![1].split('/').pop()!;
        const currentFolder = rec.url.match(/\/product-images\/(.+)$/)![1].replace(`/${currentFileName}`, '');
        const thumbPath = `${currentFolder}/thumb/${currentFileName}`;

        // Check if thumbnail already exists
        const { data: existing } = await supabase.storage
          .from('product-images')
          .list(currentFolder + '/thumb', { search: currentFileName });

        if (existing && existing.length > 0) {
          if (isAlreadyWebp) skipped++;
          continue;
        }

        // Re-fetch the (now WebP) image for thumbnail if we converted
        let thumbSourceFile = file;
        if (!isAlreadyWebp) {
          const reResp = await fetch(rec.url);
          if (reResp.ok) {
            const reBlob = await reResp.blob();
            thumbSourceFile = new File([reBlob], currentFileName, { type: reBlob.type });
          }
        }

        const thumbnail = await compressImage(thumbSourceFile, rec.thumbMaxWidth, 0.75);

        const { error: thumbErr } = await supabase.storage
          .from('product-images')
          .upload(thumbPath, thumbnail, STORAGE_CACHE_OPTIONS);

        if (thumbErr) {
          addLog(`[FAIL] ${rec.table}/${rec.id} — thumbnail: ${thumbErr.message}`);
        } else {
          thumbsCreated++;
          if (isAlreadyWebp) {
            addLog(`[THUMB] ${rec.table}/${rec.id} — thumbnail created`);
          }
        }
      } catch (err) {
        addLog(`[FAIL] ${rec.table}/${rec.id} — ${err instanceof Error ? err.message : 'unknown error'}`);
        failed++;
      }
    }

    addLog(`\n========== DONE ==========`);
    addLog(`Converted to WebP: ${converted}`);
    addLog(`Thumbnails created: ${thumbsCreated}`);
    addLog(`Skipped: ${skipped}`);
    addLog(`Failed: ${failed}`);
    setStatus('done');
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-dark-green mb-2">Optimize Images</h1>
      <p className="text-sm text-dark-green/70 mb-6">
        Converts all existing JPEG/PNG images to WebP and generates thumbnails.
        This reduces bandwidth usage by 50-80%. Already-converted images are skipped.
      </p>

      <div className="bg-white rounded-lg shadow p-4 mb-6 text-sm text-dark-green/80">
        <p className="font-medium text-dark-green mb-2">What this does:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Converts full-size JPEG/PNG → WebP (compressed, capped dimensions)</li>
          <li>Updates database URLs to point to new WebP files</li>
          <li>Deletes old JPEG/PNG originals from storage</li>
          <li>Creates small thumbnails for grid/list views</li>
          <li>Sets 1-year cache headers on all files</li>
        </ul>
      </div>

      <button
        onClick={run}
        disabled={status === 'running'}
        className={`px-6 py-3 rounded-lg text-white font-medium ${
          status === 'running'
            ? 'bg-dark-green/50 cursor-not-allowed'
            : 'bg-dark-green hover:bg-dark-green/90'
        } transition-colors`}
      >
        {status === 'running'
          ? `Processing ${progress.current}/${progress.total}...`
          : status === 'done'
            ? 'Run Again'
            : 'Optimize All Images'}
      </button>

      {log.length > 0 && (
        <div
          ref={logRef}
          className="mt-6 bg-gray-900 text-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto font-mono text-xs"
        >
          {log.map((line, i) => (
            <div
              key={i}
              className={
                line.startsWith('[CONVERTED]')
                  ? 'text-green-400'
                  : line.startsWith('[THUMB]')
                    ? 'text-blue-400'
                    : line.startsWith('[FAIL]')
                      ? 'text-red-400'
                      : line.startsWith('[SKIP]')
                        ? 'text-yellow-400'
                        : line.startsWith('=')
                          ? 'text-white font-bold mt-2'
                          : 'text-gray-300'
              }
            >
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
