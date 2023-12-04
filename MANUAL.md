# Pioneer DDJ-SX2 MIDI Mapping for Mixxx - user guide

most controls work identically in both Serato and Mixxx - refer to the official manual for these.

however, some of these controls work differently when using this mapping. the next sections deal with these.

# browser section

the TRACK#, BPM, SONG and ARTIST do not have any effect. Mixxx does not expose a control which allows sorting by trait. this may have changed in the latest version, but I am not sure.

pressing the rotary selector switches between the left and right panels of the Library.

the BACK button goes to the left panel of the Library.

VIEW (SHIFT + BACK) toggles between 8 view modes:
- two decks, waveforms in decks, mixer visible
- four decks, waveforms in decks, mixer visible
- two decks, stacked waveforms, mixer visible
- four decks, stacked waveforms, mixer visible
- two decks, waveforms in decks, mixer hidden
- four decks, waveforms in decks, mixer hidden
- two decks, stacked waveforms, mixer hidden
- four decks, stacked waveforms, mixer hidden

stacked waveforms is a Deere-skin-specific setting.

the LOAD PREPARE button has no effect.

AREA (SHIFT + LOAD PREPARE) expands the library, or collapses it if already expanded.

# deck section

SHIFT + KEY LOCK: change tempo range. the available ranges are:
- ±8%
- ±16%
- ±50%
- ±90% (Mixxx maximum)

the takeover indicators (the triangle LEDs in the tempo slider) turn on when the tempo slider is moved up or down.

AUTO LOOP starts a beat loop at the playing position.
when beat loop is active, this button will disable it.

loop SLOT SELECT (SHIFT + IN) has no effect since Mixxx does not have loop slots.

RELOOP/EXIT and LOOP ACTIVE perform the same operation.

Mixxx does not have Flip. I have assigned these buttons to key change:
- REC: one semitone down
- START: one semitone up
- SLOT: reset to normal key
- LOOP (SHIFT + REC): enable track loop

SAVED LOOP (SHIFT + ROLL) allows you to store loops.
this is implemented by using higher-numbered hot cues as storage since Mixxx does not have loop slots.

SLICER changes performance pad mode to beat jump.
an older version of this mapping had a basic, flawed implementation of a slicer, but I decided to remove it since it's not a native Mixxx feature.

SLICER LOOP (SHIFT + SLICER) does nothing. I may implement something in this mode in the future.

previous track (SHIFT + CUE): when pressed, playback position is set to the beginning of the track. if it's already on the beginning, it does nothing.

SYNC: enables sync lock mode. Mixxx's SYNC button only sets the tempo of a deck to match the other(s), but it does not enable sync lock unless long-pressed.

beat grid operation:
- ADJUST: allows you to change the beat grid tempo.
- SLIDE: allows you to slide the beat grid.
- SET (SHIFT + ADJUST): sets the beat grid to the playing position. Mixxx does not have the concept of beat markers, but oddly enough it supports variable tempo tracks with no configuration whatsoever...
- CLEAR (SHIFT + SLIDE): has no effect for now.

PANEL SELECT toggles between sampler, effects and nothing.

# mixer section

when this mapping is loaded, the filter resonance is increased to sound better.

crossfader start is not implemented (?).

sampler volume sets pre-gain on all sampler slots since there's no global sampler volume control in Mixxx.

# effect section

Mixxx's effect framework now has a "collapsed" mode which maps much better to the DDJ-SX2.

however, Mixxx still has an "advanced" ("expanded") mode in where every effect parameter is exposed.

this mapping only supports the collapsed mode, but I may revive the code for handling the advanced mode at some point.

the three effect knobs set the dry/wet level.

the ON buttons toggle effects.

FX SELECT (SHIFT + ON) changes the effect.

the BEATS knob sets the wet/dry level of the effect unit.

the TAP button underneath sets whether to mix as wet/dry or wet+dry.

FX MODE (SHIFT + TAP) allows you to expand or collapse the effect panel.

# jog dial display section

the four red lights display the current beat or number of rotations (you can set this up by modifying the script).

# performance pads

these allow you to trigger... yeah. you know.

- hot cue mode: set, seek to and clear hot cues. behavior is identical.
- roll mode: trigger beat loops. the first pad triggers the shortest loop and the last one triggers the longest.
  - parameter 1 allows you to select the duration of these (in beats). the available durations are:
    - 1/32 shortest; 4 longest
    - 1/16 shortest; 8 longest
    - 1/8 shortest; 16 longest (default)
    - 1/4 shortest; 32 longest
    - 1/2 shortest; 64 longest
  - the pads' color will change to reflect the selected durations.
- slicer mode: actually beat jump mode when using this mapping.
  - the upper buttons trigger forward beat jumps.
  - the lower buttons trigger backward beat jumps.
  - pads at the left trigger shorter jumps.
  - pads at the right trigger longer jumps.
  - you can set the length of these jumps with parameter 1. the available jump sizes (in beats) are:
    - 1/32, 1/16, 1/8, 1/4
    - 1/16,  1/8, 1/4, 1/2
    -  1/8,  1/4, 1/2,   1
    -  1/4,  1/2,   1,   2
    -  1/2,    1,   2,   4
    -    1,    2,   4,   8
    -    2,    4,   8,  16
    -    4,    8,  16,  32
    -    8,   16,  32,  64
  - the color of the mode indicator will change to reflect the selected lengths.
- sampler mode: trigger samples.
  - parameter 1 allows you to choose between pages.
  - each page has 8 samples.
  - you can select one of 8 pages.
  - the Deere (64 Samplers) or Tango (64 Samplers) skin is necessary to view all 64 samples.
- cue loop: same function as hot cue, but starts a loop.
- saved loop: this allows you to store loops for later usage.
  - Mixxx does not have loop slots.
  - therefore this feature is implemented using hot cues as loop markers.
  - the parameter 1 button has no effect.
- slicer loop: nothing to see here yet.
- velocity sampler: same thing as sampler, except that the pads become pressure-sensitive and set volume when pressed.
