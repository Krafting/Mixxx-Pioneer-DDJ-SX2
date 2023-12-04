# Pioneer DDJ-SX2 MIDI Mapping for Mixxx

based on hrudham's DDJ-SR mapping, with lots of modifications to make it work on the SX2 and support most of its features.

# how do I use it?

if you just want to get your controller working with Mixxx without bothering about the details much, then do the following:

1. clone this repository, or download it as a zip.
2. copy `bin/PIONEER_DDJ-SX2.midi.xml` and `bin/PIONEER_DDJ-SX2-scripts.js` to `[Mixxx Directory]/controllers`. This will probably be one of the following locations:
  - Windows: `C:\Program Files\Mixxx\controllers`
  - Linux: `/usr/share/mixxx/controllers or /usr/local/share/mixxx/controllers`
  - macOS: `/Applications/Mixxx.app/Contents/Resources/controllers`
3. make sure your Pioneer DDJ-SX2 is plugged in and turned on.
4. open (or restart) Mixxx, and enjoy using your controller

## controller setup

the DDJ-SX2 uses a SysEx to go into Serato mode, so we trick the controller into "this is Serato". no extra setup is involved. 

**do not set your SX2 to MIDI mode**. certain features such as needle position, beat indicator and slip flash are not available in MIDI mode.

# differences between SX2 and Mixxx

since the DDJ-SX2 is geared towards usage with Serato DJ, some buttons have been mapped to different behavior in Mixxx. read [MANUAL.md](MANUAL.md) for more information.

# what if I have an SX, or SX3?

it *may* work. I haven't tested it, but it may work.
[here's a fork of an earlier version of this repo](https://github.com/ardje/Mixxx-Pioneer-DDJ-SX3) which modifies this mapping to work on the SX3.

# what about an SZ/SZ2?

it *might* work but many features will be missing.

# what if I have a different Pioneer DJ controller?

it's very likely that it won't work. newer controllers are totally different.

# I found a bug.

awesome! go to the "Issues" section, and create an issue.

# I want to help.

you can fork this repository, clone it, install this mapping, and modify it using Mixxx and your favorite text editor. then copy the changes back to cloned repo, and commit.

make a pull request when done.
