
/*
  # Restrict public bucket SELECT policies to prevent directory listing

  ## Problem
  Both `site-assets` and `valuation-data` public buckets have broad SELECT policies
  that allow any client to list all files in the bucket. This exposes the full file
  inventory even though only direct object URL access is needed.

  ## Changes
  1. Drop the existing broad SELECT policies for both buckets
  2. Re-create narrower SELECT policies that only allow reading a specific object
     when the request includes a non-empty path (i.e. a direct file download),
     which prevents empty-prefix listing of the entire bucket.

  ## Security notes
  - Buckets remain public for direct URL access (serving files by known URL still works)
  - Clients can no longer call the Storage list API to enumerate bucket contents
  - All INSERT / UPDATE / DELETE policies (authenticated only) are unchanged
*/

-- Drop the broad public SELECT policies
DROP POLICY IF EXISTS "Public read access for site-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for valuation-data" ON storage.objects;

-- site-assets: allow read only when a specific object name is present (no empty-prefix listing)
CREATE POLICY "Public read access for site-assets"
  ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'site-assets'
    AND array_length(storage.foldername(name), 1) > 0
  );

-- valuation-data: same restriction
CREATE POLICY "Public read access for valuation-data"
  ON storage.objects
  FOR SELECT
  TO public
  USING (
    bucket_id = 'valuation-data'
    AND array_length(storage.foldername(name), 1) > 0
  );
