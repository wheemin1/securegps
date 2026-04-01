# QA Device Matrix

Purpose: Verify trust and usability for metadata edit flow, map pin UX, and summary accuracy.

## Test Environments

1. Desktop Chrome (latest)
2. Android Chrome (latest, portrait first)
3. iOS Safari (latest, portrait first)
4. Optional: Android landscape baseline
5. Optional: iOS landscape baseline

## Pre-check

1. Run `npm run check`
2. Run `npm run build:client`
3. Confirm no runtime console error on initial load
4. Prepare 10 images:
- 5 with GPS metadata
- 5 without GPS metadata

## Core Flow Checklist

## A. Drop and Table Load

1. Drop multiple files into uploader
2. Verify table appears immediately
3. Verify each row shows top fields: GPS, Date/Time, Device
4. Verify row state transitions to Ready

Expected:
- No blocked UI
- No unexpected status freeze in Analyzing

## B. Map Modal Pin UX

1. Select 2+ rows
2. Open map modal
3. Click any point on map
4. Verify map centers smoothly to picked point
5. Verify pin is visible on clicked point
6. Verify Apply to selected is enabled only after a point is picked
7. Apply and verify selected rows lat/lng are updated

Expected:
- Pin is persistent while modal stays open
- Wrong apply without point is impossible

## C. Bulk and Safety Actions

1. Use Bulk latitude/longitude apply
2. Use Clear location
3. Use Safe mode (risk cleanup)
4. Use time offset and absolute time apply

Expected:
- Only selected rows are modified
- Non-selected rows remain unchanged

## D. Processing and Result

1. Run in Remove mode
2. Run in Add/Edit mode
3. Download result file(s)
4. Re-open output in EXIF viewer

Expected:
- Remove mode removes metadata as intended
- Edit mode writes expected GPS/time/device for JPEG path

## Summary Accuracy Checklist

Use same scenarios from EDIT_SUMMARY_CHECKLIST.md and verify result badges:

1. Pure Remove:
- `locationRemoved` increments for original GPS rows only
- `locationAdded` and `locationUpdated` remain 0

2. Bulk Location Add/Update:
- Added count matches originally empty GPS rows
- Updated count matches originally GPS-existing rows

3. Device-only update:
- `deviceUpdated` matches edited rows

4. Combined update:
- Location/date/device counters match row-level edits

## UX Regression Checks

1. Floating quick action bar does not cover critical buttons on mobile
2. Table remains usable on narrow width (horizontal scroll is acceptable)
3. Result view badges are readable and not clipped
4. No accidental double-submit on action buttons

## Pass Criteria

1. No blocker in A-D sections
2. Summary badges match expected values in all scenarios
3. No critical visual break on Android/iOS portrait
4. No data loss outside selected rows

## Fail Severity Guide

1. P0: Wrong metadata applied to non-selected files, corrupted outputs, crash
2. P1: Summary mismatch, map apply wrong coordinate, blocked flow
3. P2: Visual overlap, minor text mismatch, non-blocking layout issue

