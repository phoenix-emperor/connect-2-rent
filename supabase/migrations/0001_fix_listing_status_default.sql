-- Migration to permanently fix the default literal string value bug

ALTER TABLE public.listings
ALTER COLUMN status DROP DEFAULT,
ALTER COLUMN status SET DEFAULT 'ACTIVE';
