# Edit Summary Manual Checklist

Purpose: Validate that summary counts in result view match actual metadata edits per file.

## Scope
- Location summary
  - locationAdded
  - locationUpdated
  - locationRemoved
- Time summary
  - dateUpdated
- Device summary
  - deviceUpdated

## Test Setup
1. Prepare at least 10 files:
   - 5 files with existing GPS metadata
   - 5 files without GPS metadata
2. Ensure preview table is loaded and row selection is enabled.
3. Reset state between scenarios.

## Scenario 1: Pure Remove
- Action:
  1. Keep mode as Remove.
  2. Process 5 files that have existing GPS metadata.
- Expected Summary:
  - locationRemoved = 5
  - locationAdded = 0
  - locationUpdated = 0
  - dateUpdated = 0
  - deviceUpdated = 0
- Verify:
  - Output files no longer contain GPS coordinates.

## Scenario 2: Bulk Location Add/Update
- Action:
  1. Switch mode to Add / Edit.
  2. Select all 10 files.
  3. Apply one valid lat/lng using bulk or map apply.
  4. Process.
- Expected Summary:
  - locationAdded = number of rows that originally had no GPS
  - locationUpdated = number of rows that originally had GPS
  - locationRemoved = 0
- Verify:
  - All selected output files contain the new coordinates.

## Scenario 3: Device Name Update
- Action:
  1. Select 3 rows.
  2. Change only Device field (no GPS/time changes).
  3. Process.
- Expected Summary:
  - deviceUpdated = 3
  - locationAdded/locationUpdated/locationRemoved unchanged
  - dateUpdated unchanged
- Verify:
  - EXIF device fields are updated in outputs.

## Scenario 4: Combined Update
- Action:
  1. Select rows with mixed initial metadata.
  2. Update location + date/time + device in one run.
  3. Process.
- Expected Summary:
  - location* counters reflect original GPS existence vs final GPS validity
  - dateUpdated increments only where final date/time differs from original
  - deviceUpdated increments only where final device differs from original
- Verify:
  - Spot-check at least 2 outputs with external EXIF viewer.

## Pass Criteria
- Result badges exactly match expected counts for all scenarios.
- No row-level processing failures for valid JPEG edit path.
- No mismatch between summary and output EXIF values.
