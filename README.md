# Pioneer DDJ-SX2 MIDI Mapping for Mixxx

Based on hrudham's DDJ-SR mapping, with lots of modifications to make it work on the SX2 and support most of its features.

![images/PIONEER_DDJ-SX2.png](images/PIONEER_DDJ-SX2.png)

# How do I use it?

If you just want to get your controller working with Mixxx without bothering about the details much, then do the following:

1. Clone this repository, or download it as a zip.
2. Copy `bin/PIONEER_DDJ-SX2.midi.xml` and `bin/PIONEER_DDJ-SX2-scripts.js` to `[Mixxx Directory]/controllers`. This will probably be one of the following locations:
  - Windows: `C:\Program Files\Mixxx\controllers`
  - Linux: `~/.mixxx/controllers/`
  - macOS: `/Applications/Mixxx.app/Contents/Resources/controllers`
3. Make sure your Pioneer DDJ-SX2 is plugged in and turned on.
4. Open (or restart) Mixxx, and select the controller mapping in the Preferences of Mixxx, and enjoy!

## Controller Setup

The DDJ-SX2 uses a SysEx to go into Serato mode, so we trick the controller into "this is Serato". no extra setup is involved. 

**do not set your SX2 to MIDI mode**. certain features such as needle position, beat indicator and slip flash are not available in MIDI mode.

# Differences between SX2 and Mixxx

Since the DDJ-SX2 is geared towards usage with Serato DJ, some buttons have been mapped to different behavior in Mixxx. 

Please, read the [MANUAL.md](MANUAL.md) for more information.

# What if I have an SX, or SX3?

It *may* work. I haven't tested it, but it may work.

[Here's a fork of an earlier version of this repo](https://github.com/ardje/Mixxx-Pioneer-DDJ-SX3) which modifies this mapping to work on the SX3.

# What about an SZ/SZ2?

It *might* work but many features will be missing.

# What if I have a different Pioneer DJ controller?

It's very likely that it won't work. newer controllers are totally different.

# Are you going to upstream this?

Not yet - it still needs some work before that can happen:

- A large portion of the code is from 2016, and therefore it looks like a mess.
- Many of the run-time variables are defined outside. it's ugly.
- Some functions are unoptimized (for example, triggering samplers may result in some lag).
- The Flip buttons are mapped to key shift, but that's not what they're supposed to do. (What are their equivalent in Mixxx ?)
- Some buttons don't have mapping, and could be mapped to something:
  - Clicking the BEATS dial (+Shift Click)
  - Clear Grid (Shift + Slide)
- Needs work with Mixxx new effect framework
- Some lights turn off when pressing Shift.
- Sampler pads missing the ability to load in new samples.
- There may be some other things I probably missed.

# I found a bug.

Awesome! go to the "Issues" section, and create an issue.

# I want to help.

Feel free to open a Pull Request with your changes!