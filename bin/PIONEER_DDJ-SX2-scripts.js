// Pioneer DDJ-SX2 mapping for Mixxx
// Based on hrudham's mapping for the DDJ-SR
// Modifications by tildearrow and Krafting
//
// Thanks to:
// 		hrudham for making the DDJ-SR mapping
// 		pioneer for making such an awesome controller
//
// License: (MIT)
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

var PioneerDDJSX2 = {};

// SysEx constants
PioneerDDJSX2.keepAlive = [0xF0, 0x00, 0x20, 0x7f, 0x50, 0x01, 0xF7];
PioneerDDJSX2.recallState = [0xF0, 0x00, 0x20, 0x7f, 0x03, 0x01, 0xF7];

// Performance pad colors
// 0: off
// 1: blue
// 12: cyan
// 22: green
// 31: yellow
// 41: red
// 48: magenta
// 62: blue
// 63: black
// 64: white (actually light blue)
// 65-126: invalid
// 127: current mode default
PioneerDDJSX2.padColors = new ColorMapper({
	0x0000FF: 1,
	0x0010FF: 2,
	0x0028FF: 3,
	0x0040FF: 4,
	0x0060FF: 5,
	0x0080FF: 6,
	0x00A0FF: 7,
	0x00B0FF: 8,
	0x00D0FF: 9,
	0x00E0FF: 10,
	0x00F0FF: 11,

	0x00FFFF: 12,
	0x00FFF0: 13,
	0x00FFE0: 14,
	0x00FFD0: 15,
	0x00FFB0: 16,
	0x00FF90: 17,
	0x00FF70: 18,
	0x00FF50: 19,
	0x00FF30: 20,
	0x00FF10: 21,

	0x00FF00: 22,
	0x10FF00: 23,
	0x30FF00: 24,
	0x40FF00: 25,
	0x60FF00: 26,
	0x80FF00: 27,
	0xA0FF00: 28,
	0xC0FF00: 29,
	0xE0FF00: 30,

	0xFFFF00: 31,
	0xFFE000: 32,
	0xFFC000: 33,
	0xFFB000: 34,
	0xFFA000: 35,
	0xFF9000: 36,
	0xFF7000: 37,
	0xFF5000: 38,
	0xFF3000: 39,
	0xFF1000: 40,

	0xFF0000: 41,
	0xFF0020: 42,
	0xFF0030: 43,
	0xFF0060: 44,
	0xFF0090: 45,
	0xFF00A0: 46,
	0xFF00E0: 47,

	0xFF00FF: 48,
	0xF000FF: 49,
	0xE000FF: 50,
	0xD000FF: 51,
	0xC000FF: 52,
	0xB000FF: 53,
	0xA000FF: 54,
	0x9000FF: 55,
	0x8000FF: 56,
	0x6000FF: 57,
	0x5000FF: 58,
	0x4000FF: 59,
	0x3000FF: 60,
	0x2000FF: 61,
	0x1000FF: 62,

	0x000000: 63,
	0xF0FFFF: 64,
});

// VARIABLES BEGIN //

// General variables
PioneerDDJSX2.lightsTimer = 0;
PioneerDDJSX2.shift = 0;
PioneerDDJSX2.blinkState = 0;
PioneerDDJSX2.curPanel = 0;
PioneerDDJSX2.curView = 0;
// Variable to know if the track is currently braking or not
PioneerDDJSX2.isBraking = 0;
// When Ejecting Samples in the Sampler
PioneerDDJSX2.EjectSampleTimer = null;

// Deck variables
PioneerDDJSX2.reverse = [0, 0, 0, 0];
PioneerDDJSX2.vinylOn = [1, 1, 1, 1];
PioneerDDJSX2.padMode = [0, 0, 0, 0];

// 0: 8% of max,1: 16% of max,2: 50% of max 3: 90% of max
PioneerDDJSX2.tempoRange = [0, 0, 0, 0];
PioneerDDJSX2.closestBeatToLoopIn = [0, 0, 0, 0];

// Jog wheel variables
PioneerDDJSX2.gridSlide = [0, 0, 0, 0];
PioneerDDJSX2.gridAdjust = [0, 0, 0, 0];
PioneerDDJSX2.TurnTablePos = [0, 0, 0, 0];
PioneerDDJSX2.FinalTurnPos = [-1, -1, -1, -1];

// Roll variables
PioneerDDJSX2.rollPrec = [2, 2, 2, 2];

// Slicer variables
PioneerDDJSX2.beat = [0, 0, 0, 0];
PioneerDDJSX2.beatjumpPrec = [2, 2, 2, 2];

// Sampler variables
PioneerDDJSX2.samplerVolume = 1.0;
PioneerDDJSX2.sampleVolume = [
	0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
	0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
	0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
	0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
	0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
	0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
	0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9,
	0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9
];
PioneerDDJSX2.samplerBank = [0, 0, 0, 0];

// Effect configurator variables
// Not Used
PioneerDDJSX2.linkType = [
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	]
];
PioneerDDJSX2.linkTypeTimer = 0;
PioneerDDJSX2.currenteffect = [3, 3];
PioneerDDJSX2.currenteffectparamset = [0, 0, 0, 0, 0, 0, 0, 0];

// Connections
PioneerDDJSX2.conns = [];

// VARIABLES END //

// TODO: this is VERY unhealthy. optimize.
PioneerDDJSX2.doTimer = function() {
	if (!PioneerDDJSX2.settings.DoNotTrickController) {
		midi.sendSysexMsg(PioneerDDJSX2.keepAlive, PioneerDDJSX2.keepAlive.length);
	}
	for (var i = 0; i < 4; i++) {
		// Blink LED when slip is enabled
		if (engine.getValue("[Channel" + (i + 1) + "]", "slip_enabled")) {
			midi.sendShortMsg(0x90 + i, 0x40, PioneerDDJSX2.blinkState ? 0x7F : 0x00);
		} else {
			midi.sendShortMsg(0x90 + i, 0x40, 0x00);
		}
		// Blink LED when reversing
		if (PioneerDDJSX2.reverse[i]) {
			midi.sendShortMsg(0x90 + i, 0x38, PioneerDDJSX2.blinkState ? 0x7f : 0x00);
			midi.sendShortMsg(0x90 + i, 0x15, PioneerDDJSX2.blinkState ? 0x7f : 0x00);
		} else {
			midi.sendShortMsg(0x90 + i, 0x38, 0x00);
			midi.sendShortMsg(0x90 + i, 0x15, 0x00);
		}
	}
	// Change BlinkState
	if (PioneerDDJSX2.blinkState == 0) {
		PioneerDDJSX2.blinkState = 1;
	} else {
		PioneerDDJSX2.blinkState = 0;
	}
}

// TODO: clean up? use .trigger()?
PioneerDDJSX2.init = function(id) {
	var alpha = 1.0 / 8;

	PioneerDDJSX2.channels = {
		0x00: {},
		0x01: {},
		0x02: {},
		0x03: {}
	};

	PioneerDDJSX2.settings = {
		alpha: alpha,
		beta: alpha / 32,
		jogResolution: 2054, // 2054 for accurate scratches (until we find a more accurate value)
		vinylSpeed: 33 + 1 / 3,
		loopIntervals: ['0.03125', '0.0625', '0.125', '0.25', '0.5', '1', '2', '4', '8', '16', '32', '64'],
		tempoRanges: [0.08, 0.16, 0.32, 0.64],
		rollColors: [0x19, 0x20, 0x13, 0x0e, 0x05],
		beatjumpColors: [0x3c, 0x3a, 0x38, 0x36, 0x34, 0x32, 0x30, 0x2e, 0x2c, 0x2a, 0x28],
		cueLoopColors: [0x30, 0x35, 0x3a, 0x01, 0x05, 0x0a, 0x10, 0x15, 0x1a, 0x24, 0x27, 0x2a],
		safeScratchTimeout: engine.getSetting('safeScratchTimeout'), // 20ms is the minimum allowed here.
		CenterRedLightsBehavior: engine.getSetting('CenterRedLightsBehavior'), // 0 for rotations, 1 for beats, -1 to disable
		DoNotTrickController: engine.getSetting('DoNotTrickController'), // Do not send Serato mode keep-alive when enabled. note that center light, spin alignment and slip flash will not be available.
		SoftStartTime: engine.getSetting('SoftStartTime'), // Time for the softstart function (when hitting play) (Higher is faster) (disable with -1) (10-15 is a good default)
		BrakeTime: engine.getSetting('BrakeTime'), // Time for the brake function (when hitting pause) (Higher is faster) (disable with -1) (10-15 is a good default)
		UseShiftToBreak: engine.getSetting('UseShiftToBreak') // Time for the brake function (when hitting pause) (Higher is faster) (disable with -1) (10-15 is a good default)
	};

	PioneerDDJSX2.enums = {
		rotarySelector: {
			targets: {
				libraries: 0,
				tracklist: 1
			}
		},
		channelGroups: {
			'[Channel1]': 0x00,
			'[Channel2]': 0x01,
			'[Channel3]': 0x02,
			'[Channel4]': 0x03
		},
		samplerGroups: {
			'[Sampler1]': 0,
			'[Sampler2]': 1,
			'[Sampler3]': 2,
			'[Sampler4]': 3,
			'[Sampler5]': 4,
			'[Sampler6]': 5,
			'[Sampler7]': 6,
			'[Sampler8]': 7,
			'[Sampler9]': 8,
			'[Sampler10]': 9,
			'[Sampler11]': 10,
			'[Sampler12]': 11,
			'[Sampler13]': 12,
			'[Sampler14]': 13,
			'[Sampler15]': 14,
			'[Sampler16]': 15,
			'[Sampler17]': 16,
			'[Sampler18]': 17,
			'[Sampler19]': 18,
			'[Sampler20]': 19,
			'[Sampler21]': 20,
			'[Sampler22]': 21,
			'[Sampler23]': 22,
			'[Sampler24]': 23,
			'[Sampler25]': 24,
			'[Sampler26]': 25,
			'[Sampler27]': 26,
			'[Sampler28]': 27,
			'[Sampler29]': 28,
			'[Sampler30]': 29,
			'[Sampler31]': 30,
			'[Sampler32]': 31,
			'[Sampler33]': 32,
			'[Sampler34]': 33,
			'[Sampler35]': 34,
			'[Sampler36]': 35,
			'[Sampler37]': 36,
			'[Sampler38]': 37,
			'[Sampler39]': 38,
			'[Sampler40]': 39,
			'[Sampler41]': 40,
			'[Sampler42]': 41,
			'[Sampler43]': 42,
			'[Sampler44]': 43,
			'[Sampler45]': 44,
			'[Sampler46]': 45,
			'[Sampler47]': 46,
			'[Sampler48]': 47,
			'[Sampler49]': 48,
			'[Sampler50]': 49,
			'[Sampler51]': 50,
			'[Sampler52]': 51,
			'[Sampler53]': 52,
			'[Sampler54]': 53,
			'[Sampler55]': 54,
			'[Sampler56]': 55,
			'[Sampler57]': 56,
			'[Sampler58]': 57,
			'[Sampler59]': 58,
			'[Sampler60]': 59,
			'[Sampler61]': 60,
			'[Sampler62]': 61,
			'[Sampler63]': 62,
			'[Sampler64]': 63
		},
		hotcueIndex: {
			'hotcue_1_status': 0,
			'hotcue_2_status': 1,
			'hotcue_3_status': 2,
			'hotcue_4_status': 3,
			'hotcue_5_status': 4,
			'hotcue_6_status': 5,
			'hotcue_7_status': 6,
			'hotcue_8_status': 7,
			'hotcue_9_status': 8,
			'hotcue_10_status': 9,
			'hotcue_11_status': 10,
			'hotcue_12_status': 11,
			'hotcue_13_status': 12,
			'hotcue_14_status': 13,
			'hotcue_15_status': 14,
			'hotcue_16_status': 15,
			'hotcue_17_status': 16,
			'hotcue_18_status': 17,
			'hotcue_19_status': 18,
			'hotcue_20_status': 19,
			'hotcue_21_status': 20,
			'hotcue_22_status': 21,
			'hotcue_23_status': 22,
			'hotcue_24_status': 23
		},
		hotcueIndexColors: {
			'hotcue_1_color': 0,
			'hotcue_2_color': 1,
			'hotcue_3_color': 2,
			'hotcue_4_color': 3,
			'hotcue_5_color': 4,
			'hotcue_6_color': 5,
			'hotcue_7_color': 6,
			'hotcue_8_color': 7,
			'hotcue_9_color': 8,
			'hotcue_10_color': 9,
			'hotcue_11_color': 10,
			'hotcue_12_color': 11,
			'hotcue_13_color': 12,
			'hotcue_14_color': 13,
			'hotcue_15_color': 14,
			'hotcue_16_color': 15,
			'hotcue_17_color': 16,
			'hotcue_18_color': 17,
			'hotcue_19_color': 18,
			'hotcue_20_color': 19,
			'hotcue_21_color': 20,
			'hotcue_22_color': 21,
			'hotcue_23_color': 22,
			'hotcue_24_color': 23
		}
	};

	PioneerDDJSX2.status = {
		rotarySelector: {
			target: PioneerDDJSX2.enums.rotarySelector.targets.tracklist
		}
	};
	// Disable all lights, I guess
	// midi.sendShortMsg(0xbb,0x09,0x7f);
	midi.sendShortMsg(0x90, 0x0b, 0x10); // decoration thing
	midi.sendShortMsg(0x91, 0x0b, 0x10); // decoration thing
	midi.sendShortMsg(0x92, 0x0b, 0x10); // decoration thing
	midi.sendShortMsg(0x93, 0x0b, 0x10); // decoration thing
	midi.sendShortMsg(0x90, 0x1b, 0x7f);
	midi.sendShortMsg(0x91, 0x1b, 0x7f);
	midi.sendShortMsg(0x92, 0x1b, 0x7f);
	midi.sendShortMsg(0x93, 0x1b, 0x7f);
	PioneerDDJSX2.BindControlConnections();

	// Increase resonance of filter
	engine.setValue("[QuickEffectRack1_[Channel1]_Effect1]", "parameter2", 4);
	engine.setValue("[QuickEffectRack1_[Channel2]_Effect1]", "parameter2", 4);
	engine.setValue("[QuickEffectRack1_[Channel3]_Effect1]", "parameter2", 4);
	engine.setValue("[QuickEffectRack1_[Channel4]_Effect1]", "parameter2", 4);

	// Disable Deck lights
	midi.sendShortMsg(0xbb, 0, 0);
	midi.sendShortMsg(0xbb, 1, 0);
	midi.sendShortMsg(0xbb, 2, 0);
	midi.sendShortMsg(0xbb, 3, 0);
	midi.sendShortMsg(0xbb, 4, 0);
	midi.sendShortMsg(0xbb, 5, 0);
	midi.sendShortMsg(0xbb, 6, 0);
	midi.sendShortMsg(0xbb, 7, 0);
	for (var i = 0; i < 4; i++) {
		// set vinyl mode
		midi.sendShortMsg(0x90 + i, 0x0d, 0x7f);
		// set tempo range
		engine.setParameter("[Channel" + (i + 1) + "]", "rateRange", PioneerDDJSX2.settings.tempoRanges[PioneerDDJSX2.tempoRange[i]]);
	}
	// Change leds to mixxx's status
	for (var i = 0; i < 4; i++) {
		PioneerDDJSX2.RepaintSampler(i);
	}


	PioneerDDJSX2.FXLeds();

	// Restore lights for the HotCue
	for (var i = 1; i <= 4; i++) {
		for (var j = 1; j <= 16; j++) {
			PioneerDDJSX2.HotCuePerformancePadLed(engine.getValue("[Channel" + i + "]", "hotcue_" + j + "_status"), "[Channel" + i + "]", "hotcue_" + j + "_status");
		}
	}
	// Enable Effects Channels
	engine.setValue("[EffectRack1_EffectUnit1]", "group_[Channel1]_enable", 1);
	engine.setValue("[EffectRack1_EffectUnit1]", "group_[Channel3]_enable", 1);
	engine.setValue("[EffectRack1_EffectUnit2]", "group_[Channel2]_enable", 1);
	engine.setValue("[EffectRack1_EffectUnit2]", "group_[Channel4]_enable", 1);
	
	// Start timer
	PioneerDDJSX2.lightsTimer = engine.beginTimer(250, PioneerDDJSX2.doTimer, 0);

	// Recall State (This makes the controller freeze a bit when reloading the mapping)
	midi.sendSysexMsg(PioneerDDJSX2.recallState, PioneerDDJSX2.recallState.length);
}

PioneerDDJSX2.BindControlConnections = function() {
	for (var channelIndex = 1; channelIndex <= 4; channelIndex++) {
		var channelGroup = '[Channel' + channelIndex + ']';
		// Hook up the VU meters
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'vu_meter', PioneerDDJSX2.vu_meter));
		// the disc lights
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'playposition', PioneerDDJSX2.deckLights));
		// Play/Pause LED
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'play_indicator', PioneerDDJSX2.PlayLeds));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'sync_enabled', PioneerDDJSX2.SyncLights));
		// Cue LED
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'cue_indicator', PioneerDDJSX2.CueLeds));
		// PFL/Headphone Cue LED
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'pfl', PioneerDDJSX2.HeadphoneCueLed));
		// Keylock LED
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'keylock', PioneerDDJSX2.KeyLockLeds));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'loop_double', PioneerDDJSX2.LoopDouble));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'loop_halve', PioneerDDJSX2.LoopHalve));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'rate', PioneerDDJSX2.RateLights));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'beat_next', PioneerDDJSX2.BeatActive));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'eject', PioneerDDJSX2.UnloadLights));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'loop_enabled', PioneerDDJSX2.ReloopExit));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'loop_in', PioneerDDJSX2.ReloopExit));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'loop_out', PioneerDDJSX2.ReloopExit));
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'track_samples', PioneerDDJSX2.LoadActions));
		// Pitch
		PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'pitch_adjust', PioneerDDJSX2.PitchAdjust));
		// Hook up the hot cue/saved loop performance pads
		for (var i = 0; i < 16; i++) {
			PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'hotcue_' + (i + 1) + '_status', PioneerDDJSX2.HotCuePerformancePadLed));
			PioneerDDJSX2.conns.push(engine.makeConnection(channelGroup, 'hotcue_' + (i + 1) + '_color', PioneerDDJSX2.HotCuePerformancePadLed));
		}
	}
	// Effect Bank Selector Lights (1 or 2)
	PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit1]', 'group_[Channel1]_enable', PioneerDDJSX2.FX1CH1));
	PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit2]', 'group_[Channel1]_enable', PioneerDDJSX2.FX2CH1));
	PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit1]', 'group_[Channel2]_enable', PioneerDDJSX2.FX1CH2));
	PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit2]', 'group_[Channel2]_enable', PioneerDDJSX2.FX2CH2));
	PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit1]', 'group_[Channel3]_enable', PioneerDDJSX2.FX1CH3));
	PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit2]', 'group_[Channel3]_enable', PioneerDDJSX2.FX2CH3));
	PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit1]', 'group_[Channel4]_enable', PioneerDDJSX2.FX1CH4));
	PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit2]', 'group_[Channel4]_enable', PioneerDDJSX2.FX2CH4));

	// Effect Selector Status LEDs
	for (var i = 1; i <= 3; i++) {
		PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit1_Effect' + i + ']', 'enabled', PioneerDDJSX2.FXLeds));
		PioneerDDJSX2.conns.push(engine.makeConnection('[EffectRack1_EffectUnit2_Effect' + i + ']', 'enabled', PioneerDDJSX2.FXLeds));
	}

	// Samplers
	// Get number of enabled sampler first, then make makeConnections
	NumberOfSamplerEnabled = engine.getValue('[App]', 'num_samplers');
	for (var i = 1; i <= NumberOfSamplerEnabled; i++) {
		PioneerDDJSX2.conns.push(engine.makeConnection('[Sampler' + i + ']', 'play', PioneerDDJSX2.SamplerLight));
		PioneerDDJSX2.conns.push(engine.makeConnection('[Sampler' + i + ']', 'track_loaded', PioneerDDJSX2.SamplerLight));
	}
};

PioneerDDJSX2.UnbindControlConnections = function() {
	for (var i = 0; i < (PioneerDDJSX2.conns).length; i++) {
		if (PioneerDDJSX2.conns[i] != undefined) {
			PioneerDDJSX2.conns[i].disconnect();
		}
	}
	PioneerDDJSX2.conns = [];
};

PioneerDDJSX2.SyncLights = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	midi.sendShortMsg(0x90 + channel, 0x58, value ? 0x7f : 0x00);
};


// Unload lights when we eject a track.
PioneerDDJSX2.UnloadLights = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	// Turn off all channel lights
	for (var k = 0; k < 0x30; k++) {
		midi.sendShortMsg(0x97 + channel, k, 0x00);
	}
	for (var k = 0x40; k < 0x70; k++) {
		midi.sendShortMsg(0x97 + channel, k, 0x00);
	}
	midi.sendShortMsg(0xbb, channel, 0);
	midi.sendShortMsg(0xbb, 4 + channel, 0);
};

// This handles LEDs related to the PFL/Headphone Cue event.
PioneerDDJSX2.HeadphoneCueLed = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	midi.sendShortMsg(0x90 + channel, 0x54, value ? 0x7F : 0x00); // Headphone Cue LED
};

// This handles sync enabling.
PioneerDDJSX2.SyncEnable = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	if (control == 127) {
		if (value == 0 || value == 2) {
			engine.setValue("[Channel" + (value + 1) + "]", "sync_enabled", 1);
			engine.setValue("[Channel" + (value + 2) + "]", "sync_enabled", 1);
		} else {
			engine.setValue("[Channel" + (value + 1) + "]", "sync_enabled", 1);
			engine.setValue("[Channel" + (value) + "]", "sync_enabled", 1);
		}
	}
};

// This handles sync disabling.
PioneerDDJSX2.SyncDisable = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	if (control == 127) {
		if (value == 0 || value == 2) {
			engine.setValue("[Channel" + (value + 1) + "]", "sync_enabled", 0);
			engine.setValue("[Channel" + (value + 2) + "]", "sync_enabled", 0);
		} else {
			engine.setValue("[Channel" + (value + 1) + "]", "sync_enabled", 0);
			engine.setValue("[Channel" + (value) + "]", "sync_enabled", 0);
		}
	}
};

// This handles LEDs related to the PFL/Headphone Cue event- i mean, slip.
PioneerDDJSX2.slipenabled = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];

	if (control == 127) {
		if (engine.getValue("[Channel" + (value + 1) + "]", "play")) {
			engine.setValue("[Channel" + (value + 1) + "]", "slip_enabled", !engine.getValue("[Channel" + (value + 1) + "]", "slip_enabled"));
			midi.sendShortMsg(0x90 + value, 0x3e, engine.getValue("[Channel" + (value + 1) + "]", "slip_enabled") ? 0x7F : 0x00); // Headphone Cue LED
		} else {
			engine.setValue("[Channel" + (value + 1) + "]", "slip_enabled", !engine.getValue("[Channel" + (value + 1) + "]", "slip_enabled"));
		}
	}
};

PioneerDDJSX2.BeatActive = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	var howmuchshallwejump = 1;

	// console.info(1 + (PioneerDDJSX2.beat[channel] % 8))

	// slicer lights
	PioneerDDJSX2.beat[channel] = Math.round(value / engine.getValue(group, "track_samplerate") * (engine.getValue(group, "file_bpm") / 120.0)) - 1;
	// console.info(PioneerDDJSX2.beat[channel])
	if (PioneerDDJSX2.settings.CenterRedLightsBehavior == 1) {
		midi.sendShortMsg(0xBB, 0x04 + channel, 1 + (PioneerDDJSX2.beat[channel] % 8));
	}

	// midi.sendShortMsg(0x90,0x24,0x7f);

	// Slicer lights, if we are in slicer mode
	if (PioneerDDJSX2.padMode[channel] == 2) {
	    midi.sendShortMsg(0x97 + channel, 0x20, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 0) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x21, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 1) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x22, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 2) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x23, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 3) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x24, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 4) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x25, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 5) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x26, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 6) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x27, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 7) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x28, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 0) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x29, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 1) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x2a, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 2) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x2b, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 3) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x2c, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 4) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x2d, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 5) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x2e, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 6) ? 0x01 : 0x28);
	    midi.sendShortMsg(0x97 + channel, 0x2f, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 7) ? 0x01 : 0x28);
	}
	// Slicer loop lights
	if (PioneerDDJSX2.padMode[channel] == 6) {
	    midi.sendShortMsg(0x97 + channel, 0x60, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 0) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x61, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 1) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x62, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 2) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x63, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 3) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x64, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 4) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x65, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 5) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x66, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 6) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x67, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 7) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x68, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 0) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x69, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 1) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x6a, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 2) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x6b, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 3) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x6c, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 4) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x6d, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 5) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x6e, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 6) ? 0x28 : 0x01);
	    midi.sendShortMsg(0x97 + channel, 0x6f, ((Math.floor(PioneerDDJSX2.beat[channel] % 8)) == 7) ? 0x28 : 0x01);
	}
};

// This handles LEDs related to the PFL/Headphone Cue event.
PioneerDDJSX2.deckLights = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];

	PioneerDDJSX2.TurnTablePos[channel] = (engine.getValue(group, "playposition") * (engine.getValue(group, "track_samples") / engine.getValue(group, "track_samplerate")) / 2);

	const finalPos = Math.floor(1 + (PioneerDDJSX2.TurnTablePos[channel] * 39.96) % 0x48);
	// console.info(finalPos);
	if (finalPos != PioneerDDJSX2.FinalTurnPos[channel]) {
		PioneerDDJSX2.FinalTurnPos[channel] = finalPos;
		midi.sendShortMsg(0xbb, channel, finalPos); // Headphone Cue LED
		// Red LEDs in the center
		if (PioneerDDJSX2.settings.CenterRedLightsBehavior == 0) {
			midi.sendShortMsg(0xbb, 0x04 + channel, (1 + Math.floor((engine.getValue(group, "playposition") * (engine.getValue(group, "track_samples") / engine.getValue(group, "track_samplerate")) / 2) * 39.96) / 0x48) % 8);
		}
	}
};

// This handles the crossfader curve.
PioneerDDJSX2.CrossfaderCurve = function(value, group, control) {
	engine.setValue("[Mixer Profile]", "xFaderCurve", control / 16);
};

// This handles the input select switches. (on the front side of the controller)
PioneerDDJSX2.InputSelect = function(group, control, value, status) {
	engine.setValue("[Channel" + (group + 1) + "]", "mute", value ? 1 : 0);
}

// This handles the loop in button.
PioneerDDJSX2.LoopIn = function(group, control, value, status) {
	engine.setValue("[Channel" + (group + 1) + "]", "loop_in", value ? 1 : 0);
	if (value == 0x7f) {
		PioneerDDJSX2.closestBeatToLoopIn[group] = engine.getValue("[Channel" + (group + 1) + "]", "beat_closest");
	}
}

// This handles 4 beat loop.
PioneerDDJSX2.FourBeat = function(group, control, value, status) {
	var channel = "[Channel" + (group + 1) + "]";
	var loop_enable;

	if (value == 0x7f) {
		loop_enable = engine.getValue(channel, 'loop_enabled')

		engine.setValue(channel, "loop_start_position", PioneerDDJSX2.closestBeatToLoopIn[group]);
		engine.setValue(channel, "loop_end_position", PioneerDDJSX2.closestBeatToLoopIn[group] + engine.getValue(channel, 'track_samplerate') * (480 / engine.getValue(channel, 'file_bpm')));

		if (!loop_enable) {
			engine.setValue(channel, "reloop_toggle", 1);
		}
	}
}

// This handles LEDs related to the loop double event. (button 2x)
PioneerDDJSX2.LoopDouble = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	midi.sendShortMsg(0x90 + channel, 0x13, value ? 0x7F : 0x00);
};

// This handles LEDs related to the loop halve event. (button 1/2x)
PioneerDDJSX2.LoopHalve = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	midi.sendShortMsg(0x90 + channel, 0x12, value ? 0x7F : 0x00);
};

// This handles LEDs
PioneerDDJSX2.SlipMode = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	if (engine.getValue(group, "play")) {
		midi.sendShortMsg(0x90 + channel, 0x40, value ? 0x7F : 0x00);
	}
};

// When loading a song
PioneerDDJSX2.LoadActions = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];

	if (value) {
		// Load button animation (blinking)
		midi.sendShortMsg(0x9b, channel, 0x7F);

		// fixxx -kraft: no idea what it is supposed to do...
		// engine.setValue("[QuickEffectRack1_[Channel1]_Effect1]", "parameter2", 4);
		// engine.setValue("[QuickEffectRack1_[Channel2]_Effect1]", "parameter2", 4);
		// engine.setValue("[QuickEffectRack1_[Channel3]_Effect1]", "parameter2", 4);
		// engine.setValue("[QuickEffectRack1_[Channel4]_Effect1]", "parameter2", 4);
	}
};

// This handles LEDs related
PioneerDDJSX2.ReloopExit = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	midi.sendShortMsg(0x90 + channel, 0x14, engine.getValue(group, "loop_enabled") ? 0x7F : 0x00);
	midi.sendShortMsg(0x90 + channel, 0x10, (engine.getValue(group, "loop_start_position") > -1) ? 0x7F : 0x00);
	midi.sendShortMsg(0x90 + channel, 0x11, (engine.getValue(group, "loop_end_position") > -1) ? 0x7F : 0x00);
}; 

// yeah -kraft: what ?
PioneerDDJSX2.PitchAdjust = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	if (value != 0) {
		if (value > 0) {
			midi.sendShortMsg(0x90 + channel, 0x4a, 0x00);
			midi.sendShortMsg(0x90 + channel, 0x4b, 0x7F);
		} else {
			midi.sendShortMsg(0x90 + channel, 0x4a, 0x7F);
			midi.sendShortMsg(0x90 + channel, 0x4b, 0x00);
		}
	} else {
		midi.sendShortMsg(0x90 + channel, 0x4a, 0x00);
		midi.sendShortMsg(0x90 + channel, 0x4b, 0x00);
	}
};

// FX Channel (1 or 2) selector LEDs for each channel
PioneerDDJSX2.FX1CH1 = function(value, group, control) {
	midi.sendShortMsg(0x96, 0x4C, value ? 0x7F : 0x00);
};

PioneerDDJSX2.FX2CH1 = function(value, group, control) {
	midi.sendShortMsg(0x96, 0x50, value ? 0x7F : 0x00);
};

PioneerDDJSX2.FX1CH2 = function(value, group, control) {
	midi.sendShortMsg(0x96, 0x4D, value ? 0x7F : 0x00);
};

PioneerDDJSX2.FX2CH2 = function(value, group, control) {
	midi.sendShortMsg(0x96, 0x51, value ? 0x7F : 0x00);
};

PioneerDDJSX2.FX1CH3 = function(value, group, control) {
	midi.sendShortMsg(0x96, 0x4E, value ? 0x7F : 0x00);
};

PioneerDDJSX2.FX2CH3 = function(value, group, control) {
	midi.sendShortMsg(0x96, 0x52, value ? 0x7F : 0x00);
};

PioneerDDJSX2.FX1CH4 = function(value, group, control) {
	midi.sendShortMsg(0x96, 0x4F, value ? 0x7F : 0x00);
};

PioneerDDJSX2.FX2CH4 = function(value, group, control) {
	midi.sendShortMsg(0x96, 0x53, value ? 0x7F : 0x00);
};

// Cue Leds
PioneerDDJSX2.CueLeds = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	midi.sendShortMsg(0x90 + channel, 0x48, value ? 0x7f : 0x00);
	midi.sendShortMsg(0x90 + channel, 0x0C, value ? 0x7f : 0x00);
};

// Keylock event, keylock LED.
PioneerDDJSX2.KeyLockLeds = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	midi.sendShortMsg(0x90 + channel, 0x1A, value ? 0x7F : 0x00);
};

// This handles the shift key
PioneerDDJSX2.Shift = function(value, group, control) {
	PioneerDDJSX2.shift = control;
};

// Reverse Play
PioneerDDJSX2.Reverse = function(value, group, control) {
	if (control == 127) {
		PioneerDDJSX2.reverse[value] = !PioneerDDJSX2.reverse[value];
		engine.setValue("[Channel" + (value + 1) + "]", "reverse", PioneerDDJSX2.reverse[value]);
	}
};

// Reverse Play when keeping the button pressed
// Also, if we have reverse play enabled, clicking on the button without shift will cancel the reverse and back to normal
PioneerDDJSX2.ReverseHold = function(value, group, control) {
	// Reverse when pushing the button, otherwise play normally
	if (control == 127) {
		PioneerDDJSX2.reverse[value] = 1;
		engine.setValue("[Channel" + (value + 1) + "]", "reverse", PioneerDDJSX2.reverse[value]);
	} else {
		PioneerDDJSX2.reverse[value] = 0;
		engine.setValue("[Channel" + (value + 1) + "]", "reverse", PioneerDDJSX2.reverse[value]);
	}
};

// Enable Auto Loop
PioneerDDJSX2.AutoLoop = function(channel, control, value, status) {
	if (value == 127) {
		if (engine.getValue("[Channel" + (channel + 1) + "]", "loop_enabled")) {
			engine.setValue("[Channel" + (channel + 1) + "]", "reloop_toggle", 1);
		} else {
			engine.setValue("[Channel" + (channel + 1) + "]", "beatloop_activate", 1);
		}
	}
};

///////////////////////////////////////////////////////////////
//                 RATE / TEMPO SLIDER                     	 //
///////////////////////////////////////////////////////////////


// Handle the rate slider
PioneerDDJSX2.RateSlider = function(channel, group, control) {
	var zero = 64; // Value where the 0 is at

	// This is thje middle point, we should set the tempo at 0
	if (control == zero) {
		engine.setValue("[Channel" + (channel + 1) + "]", "rate", 0);
		return
	}

	var newRate = script.absoluteLin(control,1,-1,0,127)
	engine.setValue("[Channel" + (channel + 1) + "]", "rate", newRate);
};

// Set lights for the Tempo slider (rate value)
PioneerDDJSX2.RateLights = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	
	// reset ligth at the middle points, this is inverted so middle point is at -0.15625 
	if (engine.getValue(group, 'rate') == 0) {
		midi.sendShortMsg(0x90 + channel, 0x37, 0x00);
		midi.sendShortMsg(0x90 + channel, 0x34, 0x00);
		return
	}

	// If > 0 => Turn on top light (minus)
	if (engine.getValue(group, 'rate') < 0) {
		midi.sendShortMsg(0x90 + channel, 0x34, 0x7F); 
		midi.sendShortMsg(0x90 + channel, 0x37, 0x00);

	// else, if < 0 => Turn on bottom light (plus)
	} else {
		midi.sendShortMsg(0x90 + channel, 0x37, 0x7F);
		midi.sendShortMsg(0x90 + channel, 0x34, 0x00); 
	}
};


///////////////////////////////////////////////////////////////
//                    EFFECTS SETTINGS                     	 //
///////////////////////////////////////////////////////////////


// Function that control the Effect LEDs status of current enabled effects
PioneerDDJSX2.FXLeds = function() {
	// Change indicator
	for (var i = 0; i < 2; i++) {
		for (var j = 0; j < 3; j++) {
			midi.sendShortMsg(0x94 + i, 0x47 + j, engine.getValue("[EffectRack1_EffectUnit" + (i + 1) + "_Effect" + (j + 1) + "]", "enabled") ? 0x7F : 0x00);
		}
		midi.sendShortMsg(0x94 + i, 0x4a, engine.getValue("[EffectRack1_EffectUnit" + (i + 1) + "]", "mix_mode") ? 0x7F : 0x00);
	}

};

// Handle Beats Knob (turning)
// TODO: lotsa' stuff regarding the new effect system.
PioneerDDJSX2.EffectJog = function(value, group, control) {
	// control = 127 : counter-clockwise
	// control = 1 : clockwise
	if (control > 63) {
		engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "]", "mix",
			engine.getValue("[EffectRack1_EffectUnit" + (value - 3) + "]", "mix") - 0.0625 * (128 - control)
		);
	} else {
		engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "]", "mix",
			engine.getValue("[EffectRack1_EffectUnit" + (value - 3) + "]", "mix") + 0.0625 * (control)
		);
	}
};

// Beats Press (FX)
// Do Nothing for now, if we get an idea maybe later
PioneerDDJSX2.BeatsPressFX = function(value, group, control) {
	//var channel = PioneerDDJSX2.enums.channelGroups[group];
	if (control == 127) {
		PioneerDDJSX2.currenteffect[value-4]++;
		if (PioneerDDJSX2.currenteffect[value-4] > 3) {
			PioneerDDJSX2.currenteffect[value-4] = 0;
		}
		PioneerDDJSX2.FXLeds();
	}
};

// Shift + Beats Press (FX)
// Do Nothing for now, if we get an idea maybe later
PioneerDDJSX2.ShiftBeatsPressFX = function(value, group, control) {
	//var channel = PioneerDDJSX2.enums.channelGroups[group];
	if (control == 127) {
		PioneerDDJSX2.currenteffectparamset[((value==5)?(4):(0))+PioneerDDJSX2.currenteffect[value-4]]++;
		if (PioneerDDJSX2.currenteffectparamset[((value==5)?(4):(0))+PioneerDDJSX2.currenteffect[value-4]] >= (engine.getValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(PioneerDDJSX2.currenteffect[value-4]+1)+"]","num_parameters")/3)) {
			PioneerDDJSX2.currenteffectparamset[((value==5)?(4):(0))+PioneerDDJSX2.currenteffect[value-4]]=0;
		}
		// console.info(PioneerDDJSX2.currenteffectparamset[PioneerDDJSX2.currenteffect[0]]);
		// change indicator
		PioneerDDJSX2.FXLeds();
	}
};

// This handles selecting effects. (FX Select)
PioneerDDJSX2.EffectSelect = function(value, group, control) {
	engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "_Effect" + (group - 98) + "]", "effect_selector", (control == 127) ? 1 : 0);
};

// Control the Effect Knobs
PioneerDDJSX2.EffectKnob = function(value, group, control) {
	if (PioneerDDJSX2.currenteffect[value - 4] == 3) {
		switch (group) {
			case 2:
				engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "_Effect1]", "meta", control / 127);
				break;
			case 4:
				engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "_Effect2]", "meta", control / 127);
				break;
			case 6:
				engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "_Effect3]", "meta", control / 127);
				break;
		}
	} else {
		
		switch (group) {
			case 2:
				engine.setParameter("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(PioneerDDJSX2.currenteffect[value-4]+1)+"]","parameter"+(1+(PioneerDDJSX2.currenteffectparamset[((value-4)*4)+PioneerDDJSX2.currenteffect[value-4]]*3)),control/127);
				break;
			case 4:
				engine.setParameter("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(PioneerDDJSX2.currenteffect[value-4]+1)+"]","parameter"+(2+(PioneerDDJSX2.currenteffectparamset[((value-4)*4)+PioneerDDJSX2.currenteffect[value-4]]*3)),control/127);
				break;
			case 6:
				engine.setParameter("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(PioneerDDJSX2.currenteffect[value-4]+1)+"]","parameter"+(3+(PioneerDDJSX2.currenteffectparamset[((value-4)*4)+PioneerDDJSX2.currenteffect[value-4]]*3)),control/127);
				break;
		}
		
	}
};

PioneerDDJSX2.EffectButton = function(value, group, control) {
	// value: 4 for FX1 and 5 for FX2
	if (control == 127) {

		// If we are in the mode 3 in PioneerDDJSX2.currenteffect
		if (PioneerDDJSX2.currenteffect[value - 4] == 3) {
			engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "_Effect" + (group - 70) + "]", "enabled", !engine.getValue("[EffectRack1_EffectUnit" + (value - 3) + "_Effect" + (group - 70) + "]", "enabled"));
		} else {
			// console.info(((PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 71))
			// if (((PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 71) < engine.getValue("[EffectRack1_EffectUnit" + (value - 3) + "_Effect" + (PioneerDDJSX2.currenteffect[value - 4] + 1) + "]", "num_parameters")) {
			// 	PioneerDDJSX2.linkType[value - 4][PioneerDDJSX2.currenteffect[value - 4]][(PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 71]++;
			// 	if (PioneerDDJSX2.linkType[value - 4][PioneerDDJSX2.currenteffect[value - 4]][(PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 71] > 4) {
			// 		PioneerDDJSX2.linkType[value - 4][PioneerDDJSX2.currenteffect[value - 4]][(PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 71] = 0;
			// 	}
			// 	engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "_Effect" + (PioneerDDJSX2.currenteffect[value - 4] + 1) + "]", "parameter" + ((PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 70) + "_link_type", PioneerDDJSX2.linkType[value - 4][PioneerDDJSX2.currenteffect[value - 4]][(PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 71]);
			// 	PioneerDDJSX2.LinkTypeLeds(value - 4, PioneerDDJSX2.currenteffect[value - 4], (PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 71);
			// 	console.info(PioneerDDJSX2.linkType[value - 4][PioneerDDJSX2.currenteffect[value - 4]][(PioneerDDJSX2.currenteffectparamset[(4 * (value - 4)) + PioneerDDJSX2.currenteffect[value - 4]] * 3) + group - 71]);
			// } else {
			// 	console.info("ok");
			// }
		}
		// PioneerDDJSX2.FXLeds();
	}
};

// When clicking the tap button
PioneerDDJSX2.EffectTap = function(value, group, control) {
	if (control == 127) {
		if (PioneerDDJSX2.currenteffect[value - 4] == 3) {
			engine.setValue("[EffectRack1_EffectUnit" + (value - 3) + "]", "mix_mode", !engine.getValue("[EffectRack1_EffectUnit" + (value - 3) + "]", "mix_mode"));
			PioneerDDJSX2.FXLeds();
		}
	}
};

// Blink LEDs to show which type of variable we are modifying for the effect
PioneerDDJSX2.LinkTypeLeds = function(effectset, effect, param) {
	switch (PioneerDDJSX2.linkType[effectset][effect][param]) {
		case 0: // ____
			midi.sendShortMsg(0x94 + effectset, 0x47, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x48, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x49, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x4a, 0x00);
			break;
		case 1: // ----
			midi.sendShortMsg(0x94 + effectset, 0x47, 0x7f);
			midi.sendShortMsg(0x94 + effectset, 0x48, 0x7f);
			midi.sendShortMsg(0x94 + effectset, 0x49, 0x7f);
			midi.sendShortMsg(0x94 + effectset, 0x4a, 0x7f);
			break;
		case 2: // -___
			midi.sendShortMsg(0x94 + effectset, 0x47, 0x7f);
			midi.sendShortMsg(0x94 + effectset, 0x48, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x49, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x4a, 0x00);
			break;
		case 3: // ___-
			midi.sendShortMsg(0x94 + effectset, 0x47, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x48, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x49, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x4a, 0x7f);
			break;
		case 4: // -__-
			midi.sendShortMsg(0x94 + effectset, 0x47, 0x7f);
			midi.sendShortMsg(0x94 + effectset, 0x48, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x49, 0x00);
			midi.sendShortMsg(0x94 + effectset, 0x4a, 0x7f);
			break;
	}
	// Stop previous timer before launching a new one
	if (PioneerDDJSX2.linkTypeTimer != 0) {
		engine.stopTimer(PioneerDDJSX2.linkTypeTimer);
	}
	PioneerDDJSX2.linkTypeTimer = engine.beginTimer(2000, PioneerDDJSX2.FXLeds, 1);
};


///////////////////////////////////////////////////////////////
//                    MIXXX UI SETTINGS                    	 //
///////////////////////////////////////////////////////////////


// Panel Select, Show or don't show Effect Rack and Samplers
PioneerDDJSX2.PanelSelect = function(value, group, control) {
	if (control == 127) {
		PioneerDDJSX2.curPanel += ((1 - (group - 120)) * 2) - 1;

		// If we have a negative number, fallback to the mode 3
		if (PioneerDDJSX2.curPanel < 0) {
			PioneerDDJSX2.curPanel = 3;
		}

		// Reset counter after 4 presses (> 3)
		if (PioneerDDJSX2.curPanel > 3) {
			PioneerDDJSX2.curPanel = 0;
		}
		switch (PioneerDDJSX2.curPanel) {
			case 0:
				engine.setValue("[Skin]", "show_samplers", 0);
				engine.setValue("[Skin]", "show_effectrack", 0);
				break;
			case 1:
				engine.setValue("[Skin]", "show_samplers", 1);
				engine.setValue("[Skin]", "show_effectrack", 0);
				break;
			case 2:
				engine.setValue("[Skin]", "show_samplers", 0);
				engine.setValue("[Skin]", "show_effectrack", 1);
				break;
			case 3:
				engine.setValue("[Skin]", "show_samplers", 1);
				engine.setValue("[Skin]", "show_effectrack", 1);
				break;
		}
	}
};

PioneerDDJSX2.ViewButton = function(value, group, control) {
	if (control == 127) {
		PioneerDDJSX2.curView++;
		if (PioneerDDJSX2.curView > 7) {
			PioneerDDJSX2.curPanel = 0;
		}
		engine.setValue("[Skin]", "show_4decks", PioneerDDJSX2.curView & 1);
		// engine.setValue("[Deere]", "show_stacked_waveforms", PioneerDDJSX2.curView & 2);
		// engine.setValue("[Master]", "hide_mixer", PioneerDDJSX2.curView & 4);
	}
};


///////////////////////////////////////////////////////////////
//                     GRID SETTINGS                     	 //
///////////////////////////////////////////////////////////////


// Set the grid slide mode if we press the Slide button
PioneerDDJSX2.SetGridSlide = function(value, group, control) {
	PioneerDDJSX2.gridSlide[value] = control ? 1 : 0;
	midi.sendShortMsg(0x90 + value, 0x0a, control ? 0x7F : 0x00);
};

// Set the grid adjust mode if we press the Adjust button
PioneerDDJSX2.SetGridAdjust = function(value, group, control) {
	PioneerDDJSX2.gridAdjust[value] = control ? 1 : 0;
	midi.sendShortMsg(0x90 + value, 0x79, control ? 0x7F : 0x00);
};

// Reset the grid to the previous position.
PioneerDDJSX2.ClearGrid = function(value, group, control) {
	var deck = value + 1;
	engine.setValue("[Channel" + deck + "]", "beats_undo_adjustment", 1);
	midi.sendShortMsg(0x90 + value, 0x79, control ? 0x7F : 0x00);
};


///////////////////////////////////////////////////////////////
//                    		SAMPLERS                     	 //
///////////////////////////////////////////////////////////////

PioneerDDJSX2.SamplerPlay = function(group, control, value, status) {
	var sampler = "[Sampler" + (1 + (control & 7) + (PioneerDDJSX2.samplerBank[group - 7] * 8)) + "]";
	if (engine.getValue(sampler, "track_loaded")) { // play
		engine.setParameter(sampler, "start_play", value & 1);
	} else { // load
		engine.setParameter(sampler, "LoadSelectedTrack", value & 1);
	}
};

PioneerDDJSX2.SamplerStop = function(group, control, value, status) {
	var sampler = "[Sampler" + (1 + (control & 7) + (PioneerDDJSX2.samplerBank[group - 7] * 8)) + "]";

	if (value == 127) {
		// Stop the Sample
		engine.setParameter(sampler, "start_stop", value & 1);

		// Set a timer after which the sample is ejected
		PioneerDDJSX2.EjectSampleTimer = engine.beginTimer(1000, function(){
			engine.setParameter(sampler, "eject", 1);
			PioneerDDJSX2.EjectSampleTimer = null;
		}, 1);
	} else {
		// Stop timer if we release the button before the end of the timer (So we don't eject the sample)
		if (PioneerDDJSX2.EjectSampleTimer != null) {
			engine.stopTimer(PioneerDDJSX2.EjectSampleTimer); 
		}
	}
};

// Function that handle the Sampler lights.
PioneerDDJSX2.SamplerLight = function(value, group, control) {
	var sampler = PioneerDDJSX2.enums.samplerGroups[group];

	if (sampler === undefined) return;

	if (!engine.getValue(group, "track_loaded")) {
		for (var i = 0; i < 4; i++) {
			if ((PioneerDDJSX2.samplerBank[i] << 3) === (sampler & (~7))) {
				if (PioneerDDJSX2.padMode[i] == 3) { // sampler
					midi.sendShortMsg(0x97 + i, 0x30 + (sampler & 7), 0);
					midi.sendShortMsg(0x97 + i, 0x38 + (sampler & 7), 0);
				} else if (PioneerDDJSX2.padMode[i] == 7) { // velocity sampler
					midi.sendShortMsg(0x97 + i, 0x70 + (sampler & 7), 0);
					midi.sendShortMsg(0x97 + i, 0x78 + (sampler & 7), 0);
				}
			}
		}
		return;
	}

	for (var i = 0; i < 4; i++) {
		if ((PioneerDDJSX2.samplerBank[i] << 3) === (sampler & (~7))) {
			if (PioneerDDJSX2.padMode[i] == 3) { // sampler
				midi.sendShortMsg(0x97 + i, 0x30 + (sampler & 7), value ? 0x40 : 0x7f);
				midi.sendShortMsg(0x97 + i, 0x38 + (sampler & 7), value ? 0x40 : 0x7f);
			} else if (PioneerDDJSX2.padMode[i] == 7) { // velocity sampler
				midi.sendShortMsg(0x97 + i, 0x70 + (sampler & 7), value ? 0x40 : 0x7f);
				midi.sendShortMsg(0x97 + i, 0x78 + (sampler & 7), value ? 0x40 : 0x7f);
			}
		}
	}
}

// Control Volume of Velocity Sampler (Pressure Sensitive Sampler)
PioneerDDJSX2.SetSampleGain = function(group, control, value) {
	var where = (control & 7) + (PioneerDDJSX2.samplerBank[group - 7] * 8);
	PioneerDDJSX2.sampleVolume[where] = value / 127;
	engine.setParameter("[Sampler" + (1 + where) + "]", "pregain", PioneerDDJSX2.samplerVolume * PioneerDDJSX2.sampleVolume[where]);
};

// The Sampler Volume Slider in the middle of the controller
PioneerDDJSX2.SetSamplerVol = function(value, group, control) {
	PioneerDDJSX2.samplerVolume = control / 127;
	NumberOfSamplerEnabled = engine.getValue('[App]', 'num_samplers');
	for (var i = 0; i < NumberOfSamplerEnabled; i++) {
		engine.setParameter("[Sampler" + (i + 1) + "]", "pregain", PioneerDDJSX2.samplerVolume * PioneerDDJSX2.sampleVolume[i]);
	}
};


PioneerDDJSX2.RepaintSampler = function(group) {
	var ai;
	for (var i = 0; i < 8; i++) {
		ai = i + PioneerDDJSX2.samplerBank[group] * 8;
		if (engine.getValue("[Sampler" + (ai + 1) + "]", "track_loaded")) {
			if (engine.getValue("[Sampler" + (ai + 1) + "]", "play") > 0) {
				if (PioneerDDJSX2.padMode[group] == 3) {
					midi.sendShortMsg(0x97 + group, 0x30 + i, 0x40);
					midi.sendShortMsg(0x97 + group, 0x38 + i, 0x40);
				} else if (PioneerDDJSX2.padMode[group] == 7) {
					midi.sendShortMsg(0x97 + group, 0x70 + i, 0x40);
					midi.sendShortMsg(0x97 + group, 0x78 + i, 0x40);
				}
			} else {
				if (PioneerDDJSX2.padMode[group] == 3) {
					midi.sendShortMsg(0x97 + group, 0x30 + i, 0x7f);
					midi.sendShortMsg(0x97 + group, 0x38 + i, 0x7f);
				} else if (PioneerDDJSX2.padMode[group] == 7) {
					midi.sendShortMsg(0x97 + group, 0x70 + i, 0x7f);
					midi.sendShortMsg(0x97 + group, 0x78 + i, 0x7f);
				}
			}
		} else {
			if (PioneerDDJSX2.padMode[group] == 3) {
				midi.sendShortMsg(0x97 + group, 0x30 + i, 0x00);
				midi.sendShortMsg(0x97 + group, 0x38 + i, 0x00);
			} else if (PioneerDDJSX2.padMode[group] == 7) {
				midi.sendShortMsg(0x97 + group, 0x70 + i, 0x00);
				midi.sendShortMsg(0x97 + group, 0x78 + i, 0x00);
			}
		}
	}
};

// When using parameter 1 in Sampler Mode, slide the SamplerBank to the previous page
PioneerDDJSX2.SamplerParam1L = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.samplerBank[group]--;
		if (PioneerDDJSX2.samplerBank[group] < 0) {
			PioneerDDJSX2.samplerBank[group] = 0;
		} else {
			PioneerDDJSX2.RepaintSampler(group);
		}
	}
};

// When using parameter 1 in Sampler Mode, slide the SamplerBank to the next page
PioneerDDJSX2.SamplerParam1R = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.samplerBank[group]++;
		if (PioneerDDJSX2.samplerBank[group] > 7) {
			PioneerDDJSX2.samplerBank[group] = 7;
		} else {
			PioneerDDJSX2.RepaintSampler(group);
		}
	}
};


///////////////////////////////////////////////////////////////
//                     ---- SETTINGS                     	 //
///////////////////////////////////////////////////////////////


PioneerDDJSX2.SetTempoRange = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.tempoRange[group]++;
		if (PioneerDDJSX2.tempoRange[group] > 3) {
			PioneerDDJSX2.tempoRange[group] = 0;
		}
		console.info("setting tr " + PioneerDDJSX2.tempoRange[group]);
		engine.setParameter("[Channel" + (group + 1) + "]", "rateRange", PioneerDDJSX2.settings.tempoRanges[PioneerDDJSX2.tempoRange[group]]);
	}
};

// Vynil Mode (Shift + Slip)
PioneerDDJSX2.ToggleVinyl = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.vinylOn[group] = !PioneerDDJSX2.vinylOn[group];
		console.info("toggle vinyl");
	}
};

// Parameter 1 with the Roll Mode (Left)
PioneerDDJSX2.RollParam1L = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.rollPrec[group]--;
		if (PioneerDDJSX2.rollPrec[group] < 0) {
			PioneerDDJSX2.rollPrec[group] = 0;
		}
		midi.sendShortMsg(0x90 + group, 0x1e, PioneerDDJSX2.settings.rollColors[PioneerDDJSX2.rollPrec[group]]);
	}
};

// Parameter 1 with the Roll Mode (Right)
PioneerDDJSX2.RollParam1R = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.rollPrec[group]++;
		if (PioneerDDJSX2.rollPrec[group] > 4) {
			PioneerDDJSX2.rollPrec[group] = 4;
		}
		midi.sendShortMsg(0x90 + group, 0x1e, PioneerDDJSX2.settings.rollColors[PioneerDDJSX2.rollPrec[group]]);
	}
};

// Parameter 1 with the Slicer Mode (Left)
PioneerDDJSX2.SlicerParam1L = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.beatjumpPrec[group]--;
		if (PioneerDDJSX2.beatjumpPrec[group] < 0) {
			PioneerDDJSX2.beatjumpPrec[group] = 0;
		}
		midi.sendShortMsg(0x90 + group, 0x20, PioneerDDJSX2.settings.beatjumpColors[PioneerDDJSX2.beatjumpPrec[group]]);
	}
};

// Parameter 1 with the Slicer Mode (Right)
PioneerDDJSX2.SlicerParam1R = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.beatjumpPrec[group]++;
		if (PioneerDDJSX2.beatjumpPrec[group] > 8) {
			PioneerDDJSX2.beatjumpPrec[group] = 8;
		}
		midi.sendShortMsg(0x90 + group, 0x20, PioneerDDJSX2.settings.beatjumpColors[PioneerDDJSX2.beatjumpPrec[group]]);
	}
};

// Lights up the LEDs for beat-loops.
PioneerDDJSX2.RollPerformancePadLed = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];

	var padIndex = 0;
	for (var i = 0; i < 8; i++) {
		if (control === 'beatloop_' + PioneerDDJSX2.settings.loopIntervals[i + 2] + '_enabled') {
			break;
		}
		padIndex++;
	}
	if (engine.getValue('[Channel1]', 'play')) {
		// Toggle the relevant Performance Pad LED
		midi.sendShortMsg(0x97 + channel, 0x10 + padIndex, value ? 0x7F : 0x00);
	}
};


///////////////////////////////////////////////////////////////
//                     HOTCUE SETTINGS                     	 //
///////////////////////////////////////////////////////////////


PioneerDDJSX2.HotCuePerformancePadLed = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	var i = PioneerDDJSX2.enums.hotcueIndex[control];

	if (i === undefined) return;

	// Return because cue loop return one more time than hotcue with value=2, turning off the lights
	if (value === 2) return;

	if (value === 1) { // on
		const padColor = PioneerDDJSX2.padColors.getValueForNearestColor(engine.getValue(group, 'hotcue_' + (i + 1) + '_color'));

		var hotCueColor = padColor
		var hotCueLoopColor = (padColor + 8)  % 50

		// If < 8, it means it's the HoteCue (hotcue 1-8), or else it's the HotCueLoop (hotcue 9-16)		
		if(i < 8) {
			// Pad LED without shift key
			midi.sendShortMsg(0x97 + channel, 0x00 + i, hotCueColor);
			// Pad LED with shift key
			midi.sendShortMsg(0x97 + channel, 0x00 + i + 0x08, hotCueColor);
		} else if(i >= 8 && i < 16) {
			// Loop Pad LED without shift key
			midi.sendShortMsg(0x97 + channel, 0x40 + (i % 8), hotCueLoopColor);
			// Loop Pad LED with shift key
			midi.sendShortMsg(0x97 + channel, 0x40 + (i % 8) + 0x08, hotCueLoopColor);
		} else {
			// For later use 
		}
	} else {
		if(i < 8) {
			// Pad LED without shift key
			midi.sendShortMsg(0x97 + channel, 0x00 + i, 0x00);
			// Pad LED with shift key
			midi.sendShortMsg(0x97 + channel, 0x00 + i + 0x08, 0x00);
		} else if(i >= 8 && i < 16) {
			// Loop Pad LED without shift key
			midi.sendShortMsg(0x97 + channel, 0x40 + (i % 8), 0x00);
			// Loop Pad LED with shift key
			midi.sendShortMsg(0x97 + channel, 0x40 + (i % 8) + 0x08, 0x00);
		} else {
			// For later use 
		}
	}
};


///////////////////////////////////////////////////////////////
//                     VUEMETER SETTINGS                   	 //
///////////////////////////////////////////////////////////////


// Set the VU meter levels.
PioneerDDJSX2.vu_meter = function(value, group, control) {
	// VU meter range is 0 to 127 (or 0x7F).
	var level = value * 127;
	var channel = null;
	switch (group) {
		case '[Channel1]':
			channel = 0xB0;
			break;
		case '[Channel2]':
			channel = 0xB1;
			break;
		case '[Channel3]':
			channel = 0xB2;
			break;
		case '[Channel4]':
			channel = 0xB3;
			break;
	}

	midi.sendShortMsg(channel, 0x02, level);
}

///////////////////////////////////////////////////////////////
//                   PLAY BUTTON & BRAKE                     //
///////////////////////////////////////////////////////////////


// This handles LEDs related to the play event.
PioneerDDJSX2.PlayLeds = function(value, group, control) {
	var channel = PioneerDDJSX2.enums.channelGroups[group];
	midi.sendShortMsg(0x90 + channel, 0x0B, value ? 0x7F : 0x00); // Play/Pause LED
	midi.sendShortMsg(0x90 + channel, 0x47, value ? 0x7F : 0x00); // Shift Play/Pause LED
	
	// Enable animation when paused (Only when we don't trick the controller)
	if (PioneerDDJSX2.settings.DoNotTrickController) {
		midi.sendShortMsg(0x9B, 0x0c + channel, value ? 0x7F : 0x00); // play/pause animation
	}
};

// Handle the play button, this adds the ability to do braking and softstart. with corresponding settings
PioneerDDJSX2.Play = function (channel, control, value, status, group) {
	var deck = script.deckFromGroup(group); // work out which deck we are using
	var isPlaying = engine.getValue(group, 'play')

	// Check the status of the last HotCue
	// This is to determines whether or not the hot cue is currently previewing
	// If yes, we use play normally and don't invoke the Brakeing/Soft-start
	var lastHotcue = engine.getValue(group, 'hotcue_focus');
	var isLastHotcuePlaying = 0;
	if (lastHotcue != -1) {
		// 0 = unset ; 1 = set ; 2 = playing
		isLastHotcuePlaying = engine.getValue(group, 'hotcue_' + lastHotcue + '_status');
	}
	// Only call when pressing, not releasing the button
	if (value == 127) {
		// Shift + Play enable braking/softstart
		if (((control == 71 && PioneerDDJSX2.settings.UseShiftToBreak == false) || (control != 71 && PioneerDDJSX2.settings.UseShiftToBreak == true)) && isLastHotcuePlaying != 2) {
			// We use the isBraking to know if we are currently braking, so allow for fast play/pause
			// Because when braking, the track is still playing.
			if (isPlaying && PioneerDDJSX2.isBraking == 0) {
				PioneerDDJSX2.isBraking = 1

				if (PioneerDDJSX2.settings.BrakeTime >= 0) {
					engine.brake(deck, true, PioneerDDJSX2.settings.BrakeTime); // Enable brake effect
				} else {
					engine.setValue(group, 'play', 0);
				}

			// This is when we press play again but braking has not finished yet, we disable the effect, but it keeps playing
			} else if (isPlaying && PioneerDDJSX2.isBraking == 1) {
				PioneerDDJSX2.isBraking = 0
				if (PioneerDDJSX2.settings.SoftStartTime >= 0) {
					engine.softStart(deck, true, PioneerDDJSX2.settings.SoftStartTime); // Enable soft start effect
				} else {
					engine.brake(deck, false);
					engine.softStart(deck, false);
				}
			} else {
				PioneerDDJSX2.isBraking = 0

				if (PioneerDDJSX2.settings.SoftStartTime >= 0) {
					engine.softStart(deck, true, PioneerDDJSX2.settings.SoftStartTime); // Enable soft start effect
				} else {
					engine.setValue(group, 'play', 1);
				}
			}
		
		// Otherwise Play is used normally
		} else {			
			PioneerDDJSX2.isBraking = 0 // It cannot be braking when play/pause directly
			if (isPlaying) {
				engine.setValue(group, 'play', 0);
			} else {
				engine.setValue(group, 'play', 1);
			}
		}

	}
}

///////////////////////////////////////////////////////////////
//                          JOGWHEELS                        //
///////////////////////////////////////////////////////////////

// Work out the jog-wheel change/delta
PioneerDDJSX2.getJogWheelDelta = function(value) {
	// The Wheel control centers on 0x40; find out how much it's moved by.
	return value - 0x40;
}

// Toggle scratching for a channel
PioneerDDJSX2.toggleScratch = function(channel, isEnabled) {
	var deck = channel + 1;
	PioneerDDJSX2.channels[channel].disableScratchTimer = 0;

	if (isEnabled) {
		engine.scratchEnable(deck, PioneerDDJSX2.settings.jogResolution, PioneerDDJSX2.settings.vinylSpeed, PioneerDDJSX2.settings.alpha, PioneerDDJSX2.settings.beta);
	} else {
		engine.scratchDisable(deck);
	}
};

// Pitch bend a channel
PioneerDDJSX2.pitchBend = function(channel, movement) {
	var deck = channel + 1;
	var group = '[Channel' + deck + ']';

	// Make this a little less sensitive.
	movement = movement / 5;
	// Limit movement to the range of -3 to 3.
	movement = movement > 3 ? 3 : movement;
	movement = movement < -3 ? -3 : movement;

	engine.setValue(group, 'jog', movement);
};

// Schedule disabling scratch. We don't do this immediately on 
// letting go of the jog wheel, as that result in a pitch-bend.
// Instead,we set up a time that disables it,but cancel and
// re-register that timer whenever we need to to postpone the disable.
// Very much a hack,but it works,and I'm yet to find a better solution.
PioneerDDJSX2.scheduleDisableScratch = function(channel) {
	PioneerDDJSX2.channels[channel].disableScratchTimer = engine.beginTimer(PioneerDDJSX2.settings.safeScratchTimeout, () => { PioneerDDJSX2.toggleScratch(channel, false); }, true);
};

// If scratch-disabling has been schedule,then unschedule it.
PioneerDDJSX2.unscheduleDisableScratch = function(channel) {
	if (PioneerDDJSX2.channels[channel].disableScratchTimer) {
		engine.stopTimer(PioneerDDJSX2.channels[channel].disableScratchTimer);
	}
};

// Postpone scratch disabling by a few milliseconds. This is
// useful if you were scratching,but let of of the jog wheel.
// Without this,you'd end up with a pitch-bend in that case.
PioneerDDJSX2.postponeDisableScratch = function(channel) {
	PioneerDDJSX2.unscheduleDisableScratch(channel);
	PioneerDDJSX2.scheduleDisableScratch(channel);
};

// Detect when the user touches and releases the jog-wheel while 
// jog-mode is set to vinyl to enable and disable scratching.
PioneerDDJSX2.jogScratchTouch = function(channel, control, value, status) {
	if (value == 0x7F && PioneerDDJSX2.vinylOn[channel]) {
		PioneerDDJSX2.unscheduleDisableScratch(channel);
		PioneerDDJSX2.toggleScratch(channel, true);
	} else {
		PioneerDDJSX2.scheduleDisableScratch(channel);
	}
};


// To document
PioneerDDJSX2.jogSeek = function(channel, control, value, status) {
	console.info("seek " + PioneerDDJSX2.getJogWheelDelta(value));
	engine.setValue("[Channel" + (channel + 1) + "]", "beatjump", PioneerDDJSX2.getJogWheelDelta(value) / 16);
};

// Scratch or seek with the jog-wheel.
PioneerDDJSX2.jogScratchTurn = function(channel, control, value, status) {
	var deck = channel + 1;
	// Only scratch if we're in scratching mode,when 
	// user is touching the top of the jog-wheel.
	if (engine.isScratching(deck) && !PioneerDDJSX2.gridSlide[channel] && !PioneerDDJSX2.gridAdjust[channel]) {
		engine.scratchTick(deck, PioneerDDJSX2.getJogWheelDelta(value));

	// Beat Grid Adjust When pressing Slide or Adjust
	} else {
		if (PioneerDDJSX2.gridSlide[channel]) {
			if (value < 64) {
				engine.setValue("[Channel" + deck + "]", "beats_translate_earlier", 1);
			} else {
				engine.setValue("[Channel" + deck + "]", "beats_translate_later", 1);
			}
		}
		if (PioneerDDJSX2.gridAdjust[channel]) {
			if (value < 64) {
				engine.setValue("[Channel" + deck + "]", "beats_adjust_faster", 1);
			} else {
				engine.setValue("[Channel" + deck + "]", "beats_adjust_slower", 1);
			}
		}
	}
};

// Pitch bend using the jog-wheel,or finish a scratch when the wheel 
// is still turning after having released it.
PioneerDDJSX2.jogPitchBend = function(channel, control, value, status) {
	var deck = channel + 1;
	var group = '[Channel' + deck + ']';

	if (engine.isScratching(deck)) {
		engine.scratchTick(deck, PioneerDDJSX2.getJogWheelDelta(value));
		PioneerDDJSX2.postponeDisableScratch(channel);
	} else {
		// Only pitch-bend when actually playing
		if (engine.getValue(group, 'play')) {
			PioneerDDJSX2.pitchBend(channel, PioneerDDJSX2.getJogWheelDelta(value));
		}
	}
};

// Called when the jog-mode is not set to vinyl,and the jog wheel is touched.
PioneerDDJSX2.jogSeekTouch = function(channel, control, value, status) {
	var deck = channel + 1;
	var group = '[Channel' + deck + ']';

	// Only enable scratching if we're in scratching mode,when user is  
	// touching the top of the jog-wheel and the 'Vinyl' jog mode is 
	// selected.
	if (!engine.getValue(group, 'play')) {
		// Scratch if we're not playing; otherwise we'll be 
		// pitch-bending here,which we don't want.
		PioneerDDJSX2.toggleScratch(channel, value == 0x7F);
	}
};

// Call when the jog-wheel is turned. The related jogSeekTouch function 
// sets up whether we will be scratching or pitch-bending depending 
// on whether a song is playing or not.
PioneerDDJSX2.jogSeekTurn = function(channel, control, value, status) {
	var deck = channel + 1;
	if (engine.isScratching(deck)) {
		engine.scratchTick(deck, PioneerDDJSX2.getJogWheelDelta(value));
	} else {
		PioneerDDJSX2.pitchBend(channel, PioneerDDJSX2.getJogWheelDelta(value));
	}
};


///////////////////////////////////////////////////////////////
//              PERFORMANCE PADS  : SET MODE                 //
///////////////////////////////////////////////////////////////


PioneerDDJSX2.SetHotCueMode = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.padMode[group] = 0;
		midi.sendShortMsg(0x90 + group, 0x1b, 0x7f);
	}
};

PioneerDDJSX2.SetRollMode = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.padMode[group] = 1;
		midi.sendShortMsg(0x90 + group, 0x1e, PioneerDDJSX2.settings.rollColors[PioneerDDJSX2.rollPrec[group]]);
	}
};

// Slicer Mode
// Needs to be redone at some point...
PioneerDDJSX2.SetSlicerMode = function(group, control, value, status) {
    if (value == 127) {
        PioneerDDJSX2.padMode[group] = 2;
        midi.sendShortMsg(0x90 + group, 0x20, 0x7f);
		
        // Update Slicer Mode Lights
        PioneerDDJSX2.beat[group] = Math.round(engine.getValue("[Channel" + (group + 1) + "]", "beat_next") / engine.getValue("[Channel" + (group + 1) + "]", "track_samplerate") * (engine.getValue("[Channel" + (group + 1) + "]", "file_bpm") / 120.0)) - 1;

		midi.sendShortMsg(0x97 + group, 0x20, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 0) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x21, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 1) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x22, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 2) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x23, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 3) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x24, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 4) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x25, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 5) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x26, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 6) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x27, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 7) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x28, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 0) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x29, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 1) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x2a, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 2) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x2b, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 3) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x2c, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 4) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x2d, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 5) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x2e, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 6) ? 0x01 : 0x28);
        midi.sendShortMsg(0x97 + group, 0x2f, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 7) ? 0x01 : 0x28);
    }
};

PioneerDDJSX2.SetSamplerMode = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.padMode[group] = 3;
		PioneerDDJSX2.RepaintSampler(group);
		midi.sendShortMsg(0x90 + group, 0x22, 0x7f);
	}
};

PioneerDDJSX2.SetCueLoopMode = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.padMode[group] = 4;
		midi.sendShortMsg(0x90 + group, 0x69, PioneerDDJSX2.settings.cueLoopColors[3]);
	}
};

PioneerDDJSX2.SetSavedLoopMode = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.padMode[group] = 5;
		midi.sendShortMsg(0x90 + group, 0x6b, 0x7f);
	}
};

// Slicer Loop Mode
// Needs to be redone at some point...
PioneerDDJSX2.SetSlicerLoopMode = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.padMode[group] = 6;
		midi.sendShortMsg(0x90 + group, 0x6d, 0x7f);
		// update slicer loop lights
		PioneerDDJSX2.beat[group] = Math.round(engine.getValue("[Channel" + (group + 1) + "]", "beat_next") / engine.getValue("[Channel" + (group + 1) + "]", "track_samplerate") * (engine.getValue("[Channel" + (group + 1) + "]", "file_bpm") / 120.0)) - 1;
		midi.sendShortMsg(0x97 + group, 0x60, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 0) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x61, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 1) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x62, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 2) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x63, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 3) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x64, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 4) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x65, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 5) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x66, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 6) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x67, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 7) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x68, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 0) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x69, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 1) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x6a, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 2) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x6b, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 3) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x6c, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 4) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x6d, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 5) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x6e, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 6) ? 0x28 : 0x01);
		midi.sendShortMsg(0x97 + group, 0x6f, ((Math.floor(PioneerDDJSX2.beat[group] % 8)) == 7) ? 0x28 : 0x01);
	}
};

PioneerDDJSX2.SetVelocitySamplerMode = function(group, control, value, status) {
	if (value == 127) {
		PioneerDDJSX2.padMode[group] = 7;
		PioneerDDJSX2.RepaintSampler(group);
		midi.sendShortMsg(0x90 + group, 0x6f, 0x7f);
	}
};

///////////////////////////////////////////////////////////////
//                    PERFORMANCE PADS                       //
///////////////////////////////////////////////////////////////

// Saved Loops
// Same as Roll but with 
PioneerDDJSX2.SavedLoop = function (performanceChannel, control, value, status) {
	var deck = performanceChannel - 6;
	var group = '[Channel' + deck + ']';
	var interval = PioneerDDJSX2.settings.loopIntervals[control - 0x50 + 4];

	console.info(deck, group, interval, control)

	var isAutoLoopEnabled = engine.getValue(group, 'beatloop_' + interval + '_enabled');
	console.info(isAutoLoopEnabled)

	// When clicked
	if (value == 0x7F) {
		// Reset colors of all other pads
		for (var i = 0; i < 8; i++) {
			// set vinyl mode
			midi.sendShortMsg(0x97 + deck - 1, 80 + i, 0x00);
		}

		// If Loop is not enabled, we activate the interval loop
		if (isAutoLoopEnabled != 1) {
			engine.setValue(group, 'beatloop_' + interval + '_activate', 1);
	
			midi.sendShortMsg(0x97 + deck - 1, control, 0x7f);
		} else {
			engine.setValue(group, 'beatloop_' + interval + '_toggle', 1);
			console.info("HEY")
			midi.sendShortMsg(0x97 + deck - 1, control, 0x00);
		}
	}  
}

// This handles the eight performance pads below the jog-wheels 
// that deal with beat jump in the Slicer page.
// yeah. I (he) got rid of the slicer...
PioneerDDJSX2.BeatJump = function(performanceChannel, control, value, status) {
	var deck = performanceChannel - 7;
	var group = '[Channel' + (deck + 1) + ']';
	const which = (control & 3) + PioneerDDJSX2.beatjumpPrec[deck];
	var padNumber = control - 31

	if (value == 0x7F) {
		var interval = PioneerDDJSX2.settings.loopIntervals[which];

		if (control & 4) {
			// engine.setValue(group, 'beat_closest', 1);
			// engine.setValue(group, 'beatjump_size', 1);
			// engine.setValue(group, 'beatjump_backward', 1);
			engine.setValue(group, 'beatjump_' + interval + '_backward', 1);
		} else {
			engine.setValue(group, 'beatjump_' + interval + '_forward', 1);
		}
	}

	midi.sendShortMsg(0x97 + deck, control, (value == 0x7f) ? (PioneerDDJSX2.settings.beatjumpColors[which]) : (0x00));
};

// This handles the eight performance pads below the jog-wheels 
// that deal with rolls or beat loops.
PioneerDDJSX2.RollPerformancePad = function(performanceChannel, control, value, status) {
	var deck = performanceChannel - 6;
	var group = '[Channel' + deck + ']';
	var interval = PioneerDDJSX2.settings.loopIntervals[control - 0x10 + PioneerDDJSX2.rollPrec[performanceChannel - 7]];

	if (value == 0x7F) {
		engine.setValue(group, 'beatlooproll_' + interval + '_activate', 1);
	} else {
		engine.setValue(group, 'beatlooproll_' + interval + '_activate', 0);
	}

	midi.sendShortMsg(0x97 + deck - 1, control, (value == 0x7f) ? (PioneerDDJSX2.settings.rollColors[PioneerDDJSX2.rollPrec[performanceChannel - 7]]) : (0x00));
};


///////////////////////////////////////////////////////////////
//             ROTARY SELECTOR & NAVIGATION BUTTONS          //
///////////////////////////////////////////////////////////////

// Handles the rotary selector for choosing tracks,library items,crates,etc.
PioneerDDJSX2.RotarySelector = function(channel, control, value, status) {
	var delta = 0x40 - Math.abs(0x40 - value);
	var isCounterClockwise = value > 0x40;
	if (isCounterClockwise) {
		delta *= -1;
	}

	var tracklist = PioneerDDJSX2.enums.rotarySelector.targets.tracklist;
	var libraries = PioneerDDJSX2.enums.rotarySelector.targets.libraries;

	switch (PioneerDDJSX2.status.rotarySelector.target) {
		case tracklist:
			engine.setValue('[Playlist]', 'SelectTrackKnob', delta);
			break;
		case libraries:
			if (delta > 0) {
				engine.setValue('[Playlist]', 'SelectNextPlaylist', 1);
			} else if (delta < 0) {
				engine.setValue('[Playlist]', 'SelectPrevPlaylist', 1);
			}
			break;
	}
};

// Function to sort the library with Shift + Load buttons
PioneerDDJSX2.SortLibrary = function(performanceChannel, control, value, status) {
	// Only when key-down
	if (value == 127) {
		// Sort by BPM
		if (control == 88) {
			engine.setValue("[Library]", 'sort_column_toggle', 15);
		}

		// SONG == Sort by Title
		if (control == 89) {
			engine.setValue("[Library]", 'sort_column_toggle', 2);
		}

		// Sort by Track No
		if (control == 96) {
			engine.setValue("[Library]", 'sort_column_toggle', 9);
		}

		// Sort by Artist
		if (control == 97) {
			engine.setValue("[Library]", 'sort_column_toggle', 1);
		}
	}
};

PioneerDDJSX2.BackButton = function(channel, control, value, status) {
	if (value == 0x7F) {
		PioneerDDJSX2.status.rotarySelector.target = PioneerDDJSX2.enums.rotarySelector.targets.libraries;
	}
};

// When you click the rotary selector
PioneerDDJSX2.RotarySelectorClick = function(channel, control, value, status) {
	// Only trigger when the button is pressed down,not when it comes back up.
	if (value == 0x7F) {
		var target = PioneerDDJSX2.enums.rotarySelector.targets.tracklist;

		var tracklist = PioneerDDJSX2.enums.rotarySelector.targets.tracklist;
		var libraries = PioneerDDJSX2.enums.rotarySelector.targets.libraries;

		// Expand/Collapse the current item
		engine.setValue("[Playlist]", "ToggleSelectedSidebarItem", 1);

		switch (PioneerDDJSX2.status.rotarySelector.target) {
			case tracklist:
				target = libraries;
				break;
			case libraries:
				target = tracklist;
				break;
		}

		PioneerDDJSX2.status.rotarySelector.target = target;
	}
};

// Shift + Click on the rotary selector
PioneerDDJSX2.rotarySelectorShiftedClick = function(channel, control, value) {
	if (value) {
		script.toggleControl("[Library]", "GoToItem");
		// engine.setValue("[Playlist]", "ToggleSelectedSidebarItem", 1);
	}
};

///////////////////////////////////////////////////////////////
//                      SHUTDOWN                             //
///////////////////////////////////////////////////////////////

PioneerDDJSX2.shutdown = function() {
	PioneerDDJSX2.UnbindControlConnections();

	// Disable VU meters
	PioneerDDJSX2.vu_meter(0, '[Channel1]', 'vu_meter');
	PioneerDDJSX2.vu_meter(0, '[Channel2]', 'vu_meter');
	PioneerDDJSX2.vu_meter(0, '[Channel3]', 'vu_meter');
	PioneerDDJSX2.vu_meter(0, '[Channel4]', 'vu_meter');

	// Disable decks
	midi.sendShortMsg(0xbb, 0, 0);
	midi.sendShortMsg(0xbb, 1, 0);
	midi.sendShortMsg(0xbb, 2, 0);
	midi.sendShortMsg(0xbb, 3, 0);
	midi.sendShortMsg(0xbb, 4, 0);
	midi.sendShortMsg(0xbb, 5, 0);
	midi.sendShortMsg(0xbb, 6, 0);
	midi.sendShortMsg(0xbb, 7, 0);

	// Disable timer
	engine.stopTimer(PioneerDDJSX2.lightsTimer);
};