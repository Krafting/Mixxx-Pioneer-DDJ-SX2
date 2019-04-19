// Pioneer DDJ-SX2 mapping for Mixxx
// based on hrudham's mapping for the DDJ-SR
// modifications by tildearrow
// todo:
// reorganize code
// thanks to:
// hrudham for making the DDJ-SR mapping
// pioneer for making such an awesome controller
// license: (MIT)
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

var PioneerDDJSX2={};

// VARIABLES BEGIN //

// SysEx variables- erm, constants.
PioneerDDJSX2.serato=[0xF0,0x00,0x20,0x7f,0x50,0x01,0xF7];
PioneerDDJSX2.initstring=[0xF0,0x00,0x20,0x7f,0x03,0x01,0xF7];

// general variables
PioneerDDJSX2.lightsTimer=0;
PioneerDDJSX2.AreWeInShiftMode=0;
PioneerDDJSX2.tiltstatus=0;
PioneerDDJSX2.selectedpanel=0;
PioneerDDJSX2.selectedview=0;

// deck variables
PioneerDDJSX2.reverse=[0,0,0,0];
PioneerDDJSX2.vinylOn=[1,1,1,1];
PioneerDDJSX2.PadMode=[0,0,0,0];
// 0: 8% of max,1: 16% of max,2: 50% of max 3: 90% of max
PioneerDDJSX2.tempoRange=[0,0,0,0];
PioneerDDJSX2.closestBeatToLoopIn=[0,0,0,0];

// jog wheel variables
PioneerDDJSX2.gridSlide=[0,0,0,0];
PioneerDDJSX2.gridAdjust=[0,0,0,0];
PioneerDDJSX2.TurnTablePos=[0,0,0,0];

// roll variables
PioneerDDJSX2.rollPrec=[2,2,2,2];

// slicer variables
PioneerDDJSX2.oldbeat=[0,0,0,0];
PioneerDDJSX2.beat=[0,0,0,0];
PioneerDDJSX2.slicerstatus=[0,0,0,0];
PioneerDDJSX2.slicerdelta=[0,0,0,0];
PioneerDDJSX2.slicerbutton=[0,0,0,0];
PioneerDDJSX2.slicerbuttonold=[0,0,0,0];
PioneerDDJSX2.slicerblank=[0,0,0,0];
PioneerDDJSX2.slicertype=[0,0,0,0];
PioneerDDJSX2.slicergain=[0,0,0,0];
PioneerDDJSX2.slicerpost=[0,0,0,0];
PioneerDDJSX2.IgnoreBA=[0,0,0,0];
PioneerDDJSX2.IgnoreBC=[0,0,0,0];
PioneerDDJSX2.slicersched=[0,0,0,0];
PioneerDDJSX2.wherewerewe=[0,0,0,0];
PioneerDDJSX2.sliceractive=[0,0,0,0];
PioneerDDJSX2.whohandles=[0,0,0,0];
PioneerDDJSX2.slicerlightforce=[0,0,0,0];

// sampler variables
PioneerDDJSX2.samplerVolume=1.0;
PioneerDDJSX2.sampleVolume=[
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,
  0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5
];
PioneerDDJSX2.sampleplaying=[
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0
];
PioneerDDJSX2.oldsampleplaying=[
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0
];
PioneerDDJSX2.sampleplaying1=[
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0
];
PioneerDDJSX2.oldsampleplaying1=[
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0
];
PioneerDDJSX2.samplerBank=[0,0,0,0];

// cue loop variables
PioneerDDJSX2.HCLOn=[0,0,0,0];
PioneerDDJSX2.HCLNum=[0,0,0,0];
PioneerDDJSX2.hclPrec=[3,3,3,3];

// effect configurator variables
PioneerDDJSX2.lt=[
  [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ],[
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
  ]
];
PioneerDDJSX2.lttimer=0;
PioneerDDJSX2.currenteffect=[3,3];
PioneerDDJSX2.currenteffectparamset=[0,0,0,0,0,0,0,0];

// VARIABLES END //

PioneerDDJSX2.doTimer=function() {
  var ai;
  if (!PioneerDDJSX2.settings.DoNotTrickController) {
    midi.sendSysexMsg(PioneerDDJSX2.serato,PioneerDDJSX2.serato.length);
  }
  for (var i=0; i<4; i++) {
    if (engine.getValue("[Channel"+(i+1)+"]","slip_enabled")) {
      midi.sendShortMsg(0x90+i,0x40,PioneerDDJSX2.tiltstatus?0x7F:0x00);
    } else {
      midi.sendShortMsg(0x90+i,0x40,0x00);
    }
    if (PioneerDDJSX2.reverse[i]) {
      midi.sendShortMsg(0x90+i,0x38,PioneerDDJSX2.tiltstatus?0x7f:0x00);
      midi.sendShortMsg(0x90+i,0x15,PioneerDDJSX2.tiltstatus?0x7f:0x00);
    } else {
      midi.sendShortMsg(0x90+i,0x38,0x00);
      midi.sendShortMsg(0x90+i,0x15,0x00);
    }
    if (PioneerDDJSX2.HCLOn[i]) {
      midi.sendShortMsg(0x97+i,0x40+PioneerDDJSX2.HCLNum[i],(PioneerDDJSX2.tiltstatus)?PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[i]]:0x00);
      midi.sendShortMsg(0x97+i,0x48+PioneerDDJSX2.HCLNum[i],(PioneerDDJSX2.tiltstatus)?PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[i]]:0x00);
    }
  }
  for (var i=0; i<32; i++) {
    PioneerDDJSX2.oldsampleplaying1[i]=PioneerDDJSX2.sampleplaying1[i];
    PioneerDDJSX2.sampleplaying1[i]=engine.getValue("[Sampler"+(i+1)+"]","play");
    if (!PioneerDDJSX2.sampleplaying1[i]) {
      PioneerDDJSX2.oldsampleplaying[i]=PioneerDDJSX2.sampleplaying[i];
      PioneerDDJSX2.sampleplaying[i]=(engine.getValue("[Sampler"+(i+1)+"]","track_samples")>0);
    }
  }
  for (var group=0; group<4; group++) {
    for (var i=0; i<8; i++) {
      ai=i+PioneerDDJSX2.samplerBank[group]*8;
      // sampler check
      if (PioneerDDJSX2.sampleplaying1[ai]) {
        midi.sendShortMsg(0x97+group,0x30+i,(PioneerDDJSX2.tiltstatus)?0x7f:0x00);
        midi.sendShortMsg(0x97+group,0x70+i,(PioneerDDJSX2.tiltstatus)?0x7f:0x00);
        midi.sendShortMsg(0x97+group,0x38+i,(PioneerDDJSX2.tiltstatus)?0x7f:0x00);
        midi.sendShortMsg(0x97+group,0x78+i,(PioneerDDJSX2.tiltstatus)?0x7f:0x00);
      } else {
        if (PioneerDDJSX2.oldsampleplaying[ai]!=PioneerDDJSX2.sampleplaying[ai] || PioneerDDJSX2.oldsampleplaying1[ai]!=PioneerDDJSX2.sampleplaying1[ai]) {
          midi.sendShortMsg(0x97+group,0x30+i,(PioneerDDJSX2.sampleplaying[ai])?(0x7f):(0x00));
          midi.sendShortMsg(0x97+group,0x70+i,(PioneerDDJSX2.sampleplaying[ai])?(0x7f):(0x00));
          midi.sendShortMsg(0x97+group,0x38+i,(PioneerDDJSX2.sampleplaying[ai])?(0x7f):(0x00));
          midi.sendShortMsg(0x97+group,0x78+i,(PioneerDDJSX2.sampleplaying[ai])?(0x7f):(0x00));
        }
      }
    }
  }
  if (PioneerDDJSX2.tiltstatus==0) {
    PioneerDDJSX2.tiltstatus=1;
  } else {
    PioneerDDJSX2.tiltstatus=0;
  }
}

PioneerDDJSX2.init=function(id) {
  var alpha=1.0/8;
  print(id);
  PioneerDDJSX2.channels={  
    0x00: {},
    0x01: {},
    0x02: {},
    0x03: {}
  };
  
  PioneerDDJSX2.settings={
    alpha: alpha,
    beta: alpha/32,
    jogResolution: 2054,// 2054 for accurate scratches (until we find a more accurate value)
    vinylSpeed: 33+1/3,
    loopIntervals: ['0.03125','0.0625','0.125','0.25','0.5','1','2','4','8','16','32','64'],
    tempoRanges: [0.08,0.16,0.5,0.9],
    hotCueColors: [0x2A,0x24,0x01,0x1D,0x15,0x37,0x08,0x3A],// set to [0x2A,0x24,0x01,0x1D,0x15,0x37,0x08,0x3A] for serato defaults
    rollColors: [0x1d,0x16,0x13,0x0d,0x05],
    cueLoopColors: [0x30,0x35,0x3a,0x01,0x05,0x0a,0x10,0x15,0x1a,0x24,0x27,0x2a],
    safeScratchTimeout: 20,// 20ms is the minimum allowed here.
    CenterLightBehavior: 1,// 0 for rotations,1 for beats,-1 to disable
    DoNotTrickController: 0 // enable this to stop tricking your controller into "this is serato" hahaha... but be careful as enabling this will disable the red light and spin sync and the slip shower
  };
    
  PioneerDDJSX2.enumerations={
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
    }
  };
    
  PioneerDDJSX2.status={
    rotarySelector: {
      target: PioneerDDJSX2.enumerations.rotarySelector.targets.tracklist
    }
  };
  // disable all lights,i guess
  //midi.sendShortMsg(0xbb,0x09,0x7f);
  midi.sendShortMsg(0x90,0x0b,0x10); // decoration thing
  midi.sendShortMsg(0x91,0x0b,0x10); // decoration thing
  midi.sendShortMsg(0x92,0x0b,0x10); // decoration thing
  midi.sendShortMsg(0x93,0x0b,0x10); // decoration thing
  midi.sendShortMsg(0x90,0x1b,0x7f);
  midi.sendShortMsg(0x91,0x1b,0x7f);
  midi.sendShortMsg(0x92,0x1b,0x7f);
  midi.sendShortMsg(0x93,0x1b,0x7f);
  PioneerDDJSX2.BindControlConnections(false);
  //midi.sendSysexMsg(PioneerDDJSX2.initstring,initstring.length);
  // increase resonance of filter,so that mixxx becomes more serato-like HAHAHA
  engine.setValue("[QuickEffectRack1_[Channel1]_Effect1]","parameter2",4);
  engine.setValue("[QuickEffectRack1_[Channel2]_Effect1]","parameter2",4);
  engine.setValue("[QuickEffectRack1_[Channel3]_Effect1]","parameter2",4);
  engine.setValue("[QuickEffectRack1_[Channel4]_Effect1]","parameter2",4);
  // disable deck lights
  midi.sendShortMsg(0xbb,0,0);
  midi.sendShortMsg(0xbb,1,0);
  midi.sendShortMsg(0xbb,2,0);
  midi.sendShortMsg(0xbb,3,0);
  midi.sendShortMsg(0xbb,4,0);
  midi.sendShortMsg(0xbb,5,0);
  midi.sendShortMsg(0xbb,6,0);
  midi.sendShortMsg(0xbb,7,0);
  for (var i=0; i<4; i++) {
    // set vinyl mode
    midi.sendShortMsg(0x90+i,0x0d,0x7f);
    // set tempo range
    engine.setParameter("[Channel"+(i+1)+"]","rateRange",PioneerDDJSX2.settings.tempoRanges[PioneerDDJSX2.tempoRange[i]]);
  }
  // change leds to mixxx's status
  for (var i=0; i<4; i++) {
    PioneerDDJSX2.RepaintSampler(i);
  }
  PioneerDDJSX2.CCCLeds();
  for (var i=1; i<=4; i++) {
    for (var j=1; j<=8; j++) {
      PioneerDDJSX2.HotCuePerformancePadLed(engine.getValue("[Channel"+i+"]","hotcue_"+j+"_enabled"),"[Channel"+i+"]","hotcue_"+j+"_enabled");
    }
  }
  // set effects
  engine.setValue("[EffectRack1_EffectUnit1]","group_[Channel1]_enable",1);
  engine.setValue("[EffectRack1_EffectUnit2]","group_[Channel2]_enable",1);
  // start timer
  PioneerDDJSX2.lightsTimer=engine.beginTimer(250,"PioneerDDJSX2.doTimer",0);
}

PioneerDDJSX2.BindControlConnections=function(isUnbinding) {
  for (var channelIndex=1; channelIndex <= 4; channelIndex++) {
    var channelGroup='[Channel'+channelIndex+']';
    // Hook up the VU meters
    engine.connectControl(channelGroup,'VuMeter','PioneerDDJSX2.vuMeter',isUnbinding);
    // the disc lights
    engine.connectControl(channelGroup,'playposition','PioneerDDJSX2.deckLights',isUnbinding);
    // Play/Pause LED
    engine.connectControl(channelGroup,'play_indicator','PioneerDDJSX2.PlayLeds',isUnbinding);
    engine.connectControl(channelGroup,'sync_enabled','PioneerDDJSX2.SyncLights',isUnbinding);
    // Cue LED
    engine.connectControl(channelGroup,'cue_indicator','PioneerDDJSX2.CueLeds',isUnbinding);
    // PFL/Headphone Cue LED
    engine.connectControl(channelGroup,'pfl','PioneerDDJSX2.HeadphoneCueLed',isUnbinding);
    // Keylock LED
    engine.connectControl(channelGroup,'keylock','PioneerDDJSX2.KeyLockLeds',isUnbinding);
    engine.connectControl(channelGroup,'loop_double','PioneerDDJSX2.LoopDouble',isUnbinding);
    engine.connectControl(channelGroup,'loop_halve','PioneerDDJSX2.LoopHalve',isUnbinding);
    engine.connectControl(channelGroup,'rate','PioneerDDJSX2.RateThing',isUnbinding);
    engine.connectControl(channelGroup,'beat_next','PioneerDDJSX2.BeatActive',isUnbinding);
    engine.connectControl(channelGroup,'beat_closest','PioneerDDJSX2.BeatClosest',isUnbinding);
    engine.connectControl(channelGroup,'eject','PioneerDDJSX2.UnloadLights',isUnbinding);
    engine.connectControl(channelGroup,'loop_enabled','PioneerDDJSX2.ReloopExit',isUnbinding);
    engine.connectControl(channelGroup,'loop_in','PioneerDDJSX2.ReloopExit',isUnbinding);
    engine.connectControl(channelGroup,'loop_out','PioneerDDJSX2.ReloopExit',isUnbinding);
    engine.connectControl(channelGroup,'track_samples','PioneerDDJSX2.LoadActions',isUnbinding);
    // Hook up the hot cue/saved loop performance pads
    for (var i=0; i<8; i++) {
      engine.connectControl(channelGroup,'hotcue_'+(i+1)+'_enabled','PioneerDDJSX2.HotCuePerformancePadLed',isUnbinding);
      engine.connectControl(channelGroup,'hotcue_'+(16+(i*2))+'_enabled','PioneerDDJSX2.SavedLoopLights',isUnbinding);
    }
  }
  // effect lights
  engine.connectControl('[EffectRack1_EffectUnit1]','group_[Channel1]_enable','PioneerDDJSX2.FX1CH1',isUnbinding);
  engine.connectControl('[EffectRack1_EffectUnit2]','group_[Channel1]_enable','PioneerDDJSX2.FX2CH1',isUnbinding);
  engine.connectControl('[EffectRack1_EffectUnit1]','group_[Channel2]_enable','PioneerDDJSX2.FX1CH2',isUnbinding);
  engine.connectControl('[EffectRack1_EffectUnit2]','group_[Channel2]_enable','PioneerDDJSX2.FX2CH2',isUnbinding);
  engine.connectControl('[EffectRack1_EffectUnit1]','group_[Channel3]_enable','PioneerDDJSX2.FX1CH3',isUnbinding);
  engine.connectControl('[EffectRack1_EffectUnit2]','group_[Channel3]_enable','PioneerDDJSX2.FX2CH3',isUnbinding);
  engine.connectControl('[EffectRack1_EffectUnit1]','group_[Channel4]_enable','PioneerDDJSX2.FX1CH4',isUnbinding);
  engine.connectControl('[EffectRack1_EffectUnit2]','group_[Channel4]_enable','PioneerDDJSX2.FX2CH4',isUnbinding);
  // pitch
  engine.connectControl('[Channel1]','pitch_adjust','PioneerDDJSX2.PitchAdjust',isUnbinding);
  engine.connectControl('[Channel2]','pitch_adjust','PioneerDDJSX2.PitchAdjust',isUnbinding);
  engine.connectControl('[Channel3]','pitch_adjust','PioneerDDJSX2.PitchAdjust',isUnbinding);
  engine.connectControl('[Channel4]','pitch_adjust','PioneerDDJSX2.PitchAdjust',isUnbinding);
};

PioneerDDJSX2.SyncLights=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  midi.sendShortMsg(0x90+channel,0x58,value?0x7f:0x00);
};

PioneerDDJSX2.RateThing=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  if (engine.getValue(group,'rate')>0) {
    midi.sendShortMsg(0x90+channel,0x34,0x7F); // ok
    midi.sendShortMsg(0x90+channel,0x37,0x00); // Thing
  } else {
    if (engine.getValue(group,'rate')==0) {
      midi.sendShortMsg(0x90+channel,0x37,0x00); // Thing
      midi.sendShortMsg(0x90+channel,0x34,0x00); // Thing
    } else {
      midi.sendShortMsg(0x90+channel,0x37,0x7F); // Thing
      midi.sendShortMsg(0x90+channel,0x34,0x00); // Thing 
    }
  }
};

PioneerDDJSX2.UnloadLights=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  // turn off all channel lights
  for (var k=0; k<0x30; k++) {
    midi.sendShortMsg(0x97+channel,k,0x00);
  }
  for (var k=0x40; k<0x70; k++) {
    midi.sendShortMsg(0x97+channel,k,0x00);
  }
  midi.sendShortMsg(0xbb,channel,0);
  midi.sendShortMsg(0xbb,4+channel,0);
};

// This handles LEDs related to the PFL/Headphone Cue event.
PioneerDDJSX2.HeadphoneCueLed=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x90+channel,0x54,value?0x7F:0x00); // Headphone Cue LED
};

// This handles sync enabling and disabling.
PioneerDDJSX2.SyncEnable=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  if (control==127) {
    print("do");
    if (value==0 || value==2) {
      engine.setValue("[Channel"+(value+1)+"]","sync_enabled",1);
      engine.setValue("[Channel"+(value+2)+"]","sync_enabled",1);
    } else {
      engine.setValue("[Channel"+(value+1)+"]","sync_enabled",1);
      engine.setValue("[Channel"+(value)+"]","sync_enabled",1);
    }
  }
};

PioneerDDJSX2.SyncDisable=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  if (control==127) {
    print("do");
    if (value==0 || value==2) {
      engine.setValue("[Channel"+(value+1)+"]","sync_enabled",0);
      engine.setValue("[Channel"+(value+2)+"]","sync_enabled",0);
    } else {
      engine.setValue("[Channel"+(value+1)+"]","sync_enabled",0);
      engine.setValue("[Channel"+(value)+"]","sync_enabled",0);
    }
  }
};

// This handles LEDs related to the PFL/Headphone Cue event- i mean,slip.
PioneerDDJSX2.slipenabled=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  print(value);
  if (control==127) {
    if (engine.getValue("[Channel"+(value+1)+"]","play")) {
      engine.setValue("[Channel"+(value+1)+"]","slip_enabled",!engine.getValue("[Channel"+(value+1)+"]","slip_enabled"));
      midi.sendShortMsg(0x90+value,0x3e,engine.getValue("[Channel"+(value+1)+"]","slip_enabled")?0x7F:0x00); // Headphone Cue LED
    } else {
      engine.setValue("[Channel"+(value+1)+"]","slip_enabled",!engine.getValue("[Channel"+(value+1)+"]","slip_enabled"));
    }
  }
};

PioneerDDJSX2.BeatActive=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  var howmuchshallwejump=0;
  // slicer
  if (!PioneerDDJSX2.IgnoreBA[channel]) {
    if (PioneerDDJSX2.sliceractive[channel] && !PioneerDDJSX2.slicersched[channel]) {
      print("slicer off...");
      PioneerDDJSX2.sliceractive[channel]=0;
      PioneerDDJSX2.slicerbuttonold[channel]=0;
      PioneerDDJSX2.whohandles[channel]=0;
      engine.setValue(group,"slip_enabled",0);
      //engine.setValue(group,"beatjump",-PioneerDDJSX2.wherewerewe[channel]);
      PioneerDDJSX2.wherewerewe[channel]=0;
    }
    if (PioneerDDJSX2.slicersched[channel]) {
      // process schedule
      if (PioneerDDJSX2.sliceractive[channel]) {
        // umm
        print("doing postslice");
        PioneerDDJSX2.IgnoreBA[channel]=((-(PioneerDDJSX2.beat[channel]%8)+PioneerDDJSX2.slicerbutton[channel]-1)==0)?0:1;
        PioneerDDJSX2.IgnoreBC[channel]=((-(PioneerDDJSX2.beat[channel]%8)+PioneerDDJSX2.slicerbutton[channel]-1)==0)?0:1;
        engine.setValue(group,"beatjump",-(PioneerDDJSX2.beat[channel]%8)+PioneerDDJSX2.slicerbutton[channel]-1);
        PioneerDDJSX2.wherewerewe[channel]-=(PioneerDDJSX2.slicerbuttonold[channel]-PioneerDDJSX2.slicerbutton[channel])+1;
        PioneerDDJSX2.slicerbuttonold[channel]=PioneerDDJSX2.slicerbutton[channel];
        PioneerDDJSX2.slicersched[channel]=0;
      } else {
        // ok
        print("doing slicer");
        PioneerDDJSX2.whohandles[channel]=1;
        PioneerDDJSX2.IgnoreBA[channel]=1;
        PioneerDDJSX2.IgnoreBC[channel]=1;
        PioneerDDJSX2.slicerbuttonold[channel]=PioneerDDJSX2.slicerbutton[channel];
        PioneerDDJSX2.wherewerewe[channel]=-(PioneerDDJSX2.beat[channel]%8)+PioneerDDJSX2.slicerbutton[channel]-1;
        engine.setValue(group,"slip_enabled",1);
        engine.setValue(group,"beatjump",PioneerDDJSX2.wherewerewe[channel]);
        PioneerDDJSX2.slicersched[channel]=0;
        PioneerDDJSX2.sliceractive[channel]=1;
      }
    }
  } else {
    print("PioneerDDJSX2.IgnoreBAOff");
    PioneerDDJSX2.IgnoreBA[channel]=0;
  }
  // slicer lights
  print(value);
  PioneerDDJSX2.oldbeat[channel]=PioneerDDJSX2.beat[channel];
  PioneerDDJSX2.beat[channel]=Math.round(value/engine.getValue(group,"track_samplerate")*(engine.getValue(group,"file_bpm")/120.0))-1;
  if (PioneerDDJSX2.PadMode[channel]==6 && (PioneerDDJSX2.beat[channel]%8)==0 && (PioneerDDJSX2.oldbeat[channel]%8)==7) {
    print("should jump");
    engine.setValue(group,"beatjump",-8);
  }
  if ((!PioneerDDJSX2.slicerblank[channel] && PioneerDDJSX2.slicerstatus[channel]==0 && PioneerDDJSX2.slicerpost[channel]==0)/*||(PioneerDDJSX2.slicerlightforce[channel]==1)*/) {
    // slicer lights,if we are in slicer mode
    if (PioneerDDJSX2.PadMode[channel]==2) {
      print("sending lights");
      midi.sendShortMsg(0x97+channel,0x20,((Math.floor(PioneerDDJSX2.beat[channel]%8))==0)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x21,((Math.floor(PioneerDDJSX2.beat[channel]%8))==1)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x22,((Math.floor(PioneerDDJSX2.beat[channel]%8))==2)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x23,((Math.floor(PioneerDDJSX2.beat[channel]%8))==3)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x24,((Math.floor(PioneerDDJSX2.beat[channel]%8))==4)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x25,((Math.floor(PioneerDDJSX2.beat[channel]%8))==5)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x26,((Math.floor(PioneerDDJSX2.beat[channel]%8))==6)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x27,((Math.floor(PioneerDDJSX2.beat[channel]%8))==7)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x28,((Math.floor(PioneerDDJSX2.beat[channel]%8))==0)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x29,((Math.floor(PioneerDDJSX2.beat[channel]%8))==1)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x2a,((Math.floor(PioneerDDJSX2.beat[channel]%8))==2)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x2b,((Math.floor(PioneerDDJSX2.beat[channel]%8))==3)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x2c,((Math.floor(PioneerDDJSX2.beat[channel]%8))==4)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x2d,((Math.floor(PioneerDDJSX2.beat[channel]%8))==5)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x2e,((Math.floor(PioneerDDJSX2.beat[channel]%8))==6)?0x01:0x28);
      midi.sendShortMsg(0x97+channel,0x2f,((Math.floor(PioneerDDJSX2.beat[channel]%8))==7)?0x01:0x28);
    }
    // slicer loop lights
    if (PioneerDDJSX2.PadMode[channel]==6) {
      print("sending lights 1");
      midi.sendShortMsg(0x97+channel,0x60,((Math.floor(PioneerDDJSX2.beat[channel]%8))==0)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x61,((Math.floor(PioneerDDJSX2.beat[channel]%8))==1)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x62,((Math.floor(PioneerDDJSX2.beat[channel]%8))==2)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x63,((Math.floor(PioneerDDJSX2.beat[channel]%8))==3)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x64,((Math.floor(PioneerDDJSX2.beat[channel]%8))==4)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x65,((Math.floor(PioneerDDJSX2.beat[channel]%8))==5)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x66,((Math.floor(PioneerDDJSX2.beat[channel]%8))==6)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x67,((Math.floor(PioneerDDJSX2.beat[channel]%8))==7)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x68,((Math.floor(PioneerDDJSX2.beat[channel]%8))==0)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x69,((Math.floor(PioneerDDJSX2.beat[channel]%8))==1)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x6a,((Math.floor(PioneerDDJSX2.beat[channel]%8))==2)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x6b,((Math.floor(PioneerDDJSX2.beat[channel]%8))==3)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x6c,((Math.floor(PioneerDDJSX2.beat[channel]%8))==4)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x6d,((Math.floor(PioneerDDJSX2.beat[channel]%8))==5)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x6e,((Math.floor(PioneerDDJSX2.beat[channel]%8))==6)?0x28:0x01);
      midi.sendShortMsg(0x97+channel,0x6f,((Math.floor(PioneerDDJSX2.beat[channel]%8))==7)?0x28:0x01);
    }
    if (PioneerDDJSX2.slicerlightforce[channel]==1) {
      PioneerDDJSX2.slicerlightforce[channel]=0;
    }
  } else {
    PioneerDDJSX2.slicerpost[channel]=0;
  }
  // center deck light,if mode set to 1
  if (PioneerDDJSX2.settings.CenterLightBehavior==1) {
    midi.sendShortMsg(0xbb,0x04+channel,1+(PioneerDDJSX2.beat[channel]%8));
  }
  //midi.sendShortMsg(0x90,0x24, 0x7f);
};

PioneerDDJSX2.BeatClosest=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  if (!PioneerDDJSX2.IgnoreBC[channel]) {
    if (PioneerDDJSX2.sliceractive[channel] && !PioneerDDJSX2.slicersched[channel]) {
      if (PioneerDDJSX2.whohandles[channel]==2 && PioneerDDJSX2.slicertype[channel]==1) {
        print("slicer off..1.");
        PioneerDDJSX2.sliceractive[channel]=0;
        PioneerDDJSX2.slicerbuttonold[channel]=0;
        PioneerDDJSX2.whohandles[channel]=0;
        engine.setValue(group,"slip_enabled",0);
        //engine.setValue(group,"beatjump",-PioneerDDJSX2.wherewerewe[channel]);
        PioneerDDJSX2.wherewerewe[channel]=0;
      }
    }
    if (PioneerDDJSX2.slicersched[channel]) {
      if (PioneerDDJSX2.sliceractive[channel]) {
        print("postslice in HB");
        PioneerDDJSX2.IgnoreBA[channel]=((-(PioneerDDJSX2.beat[channel]%8)+PioneerDDJSX2.slicerbutton[channel]-1)==0)?0:1;
        PioneerDDJSX2.IgnoreBC[channel]=((-(PioneerDDJSX2.beat[channel]%8)+PioneerDDJSX2.slicerbutton[channel]-1)==0)?0:1;
        engine.setValue(group,"beatjump",-(PioneerDDJSX2.beat[channel]%8)+PioneerDDJSX2.slicerbutton[channel]-0.5);
        PioneerDDJSX2.wherewerewe[channel]-=(PioneerDDJSX2.slicerbuttonold[channel]-PioneerDDJSX2.slicerbutton[channel])+0.5;
        PioneerDDJSX2.slicerbuttonold[channel]=PioneerDDJSX2.slicerbutton[channel];
        PioneerDDJSX2.slicersched[channel]=0;
      } else {
        // ok
        print("doing slicer,halfbeat");
        PioneerDDJSX2.whohandles[channel]=2;
        PioneerDDJSX2.IgnoreBA[channel]=1;
        PioneerDDJSX2.IgnoreBC[channel]=1;
        PioneerDDJSX2.slicerbuttonold[channel]=PioneerDDJSX2.slicerbutton[channel];
        PioneerDDJSX2.wherewerewe[channel]=-(PioneerDDJSX2.beat[channel]%8)+PioneerDDJSX2.slicerbutton[channel]-0.5;
        PioneerDDJSX2.slicergain[channel]=Math.pow(engine.getValue(group,"VuMeter"),2.5);
        print(PioneerDDJSX2.slicergain[channel]);
        PioneerDDJSX2.slicertype[channel]=(Math.floor(PioneerDDJSX2.beat[channel]%8)!=7 && !(Math.round(PioneerDDJSX2.slicergain[channel])))?2:1;
        engine.setValue(group,"slip_enabled",1);
        engine.setValue(group,"beatjump",PioneerDDJSX2.wherewerewe[channel]);
        PioneerDDJSX2.slicersched[channel]=0;
        PioneerDDJSX2.sliceractive[channel]=1;
      }
    }
  } else {
    print("PioneerDDJSX2.IgnoreBCOff");
    PioneerDDJSX2.IgnoreBC[channel]=0;
  }
};

// This handles LEDs related to the PFL/Headphone Cue event.
PioneerDDJSX2.deckLights=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  PioneerDDJSX2.TurnTablePos[channel]=(engine.getValue(group,"playposition")*(engine.getValue(group,"track_samples")/engine.getValue(group,"track_samplerate"))/2);
  midi.sendShortMsg(0xbb,channel,1+(PioneerDDJSX2.TurnTablePos[channel]*39.96)%0x48); // Headphone Cue LED
  // red led in the center
  if (PioneerDDJSX2.settings.CenterLightBehavior==0) {
    midi.sendShortMsg(0xbb,0x04+channel,(1+Math.floor((engine.getValue(group,"playposition")*(engine.getValue(group,"track_samples")/engine.getValue(group,"track_samplerate"))/2)*39.96)/0x48)%8);
  }
};

// This handles the crossfader curve.
PioneerDDJSX2.CrossfaderCurve=function(value, group, control) {
  engine.setValue("[Mixer Profile]","xFaderCurve",control/16);
};

// This handles the input select switches.
PioneerDDJSX2.InputSelect=function(group, control, value, status) {
  engine.setValue("[Channel"+(group+1)+"]","mute",value?1:0);
}

// This handles the loop in button.
PioneerDDJSX2.LoopIn=function(group, control, value, status) {
  engine.setValue("[Channel"+(group+1)+"]","loop_in",value?1:0);
  if (value==0x7f) {
    PioneerDDJSX2.closestBeatToLoopIn[group]=engine.getValue("[Channel"+(group+1)+"]","beat_closest");
  }
}

// This handles 4 beat loop.
PioneerDDJSX2.FourBeat=function(group, control, value, status) {
  var channel="[Channel"+(group+1)+"]";
  var la;
  if (value==0x7f) {
    la=engine.getValue(channel,'loop_enabled')
    engine.setValue(channel,"loop_start_position",PioneerDDJSX2.closestBeatToLoopIn[group]);
    engine.setValue(channel,"loop_end_position",PioneerDDJSX2.closestBeatToLoopIn[group]+engine.getValue(channel,'track_samplerate')*(480/engine.getValue(channel,'file_bpm')));
    if (!la) {
      engine.setValue(channel,"reloop_exit",1);
      engine.setValue(channel,"reloop_exit",0);
    }
  }
}

// This handles LEDs related to the loop double event.
PioneerDDJSX2.LoopDouble=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x90+channel,0x13,value?0x7F:0x00); // Headphone Cue LED
};

// This handles LEDs related to the loop halve event.
PioneerDDJSX2.LoopHalve=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x90+channel,0x12,value?0x7F:0x00); // Headphone Cue LED
};

// This handles LEDs- I'm tired.
PioneerDDJSX2.SlipMode=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  if (engine.getValue(group,"play")) {
    midi.sendShortMsg(0x90+channel,0x40,value?0x7F:0x00); // Headphone Cue LED
  }
}; // reloop_exit

PioneerDDJSX2.LoadActions=function(value, group, control) {
  print("we're loading");
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  if (value) {
    // load animation
    midi.sendShortMsg(0x9b,channel,0x7F);
    // fixxx
    engine.setValue("[QuickEffectRack1_[Channel1]_Effect1]","parameter2",4);
    engine.setValue("[QuickEffectRack1_[Channel2]_Effect1]","parameter2",4);
    engine.setValue("[QuickEffectRack1_[Channel3]_Effect1]","parameter2",4);
    engine.setValue("[QuickEffectRack1_[Channel4]_Effect1]","parameter2",4);
  }
};

// This handles LEDs related- no wait.
PioneerDDJSX2.ReloopExit=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  midi.sendShortMsg(0x90+channel,0x14,engine.getValue(group,"loop_enabled")?0x7F:0x00);
  midi.sendShortMsg(0x90+channel,0x10,(engine.getValue(group,"loop_start_position")>-1)?0x7F:0x00);
  midi.sendShortMsg(0x90+channel,0x11,(engine.getValue(group,"loop_end_position")>-1)?0x7F:0x00);
  // saved loop lights
  PioneerDDJSX2.SavedLoopLights(0,group,control);
}; // reloop_exit

PioneerDDJSX2.SavedLoopLights=function(value, group, control) {
  print("sll");
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  for (var i=0; i<8; i++) {
    midi.sendShortMsg(0x97+channel,0x50+i,(engine.getValue(group,"hotcue_"+(16+(i*2))+"_position")>-1)?(engine.getValue(group,"hotcue_"+(16+(i*2))+"_position")==engine.getValue(group,"loop_start_position")?0x01:0x7f):0x00);
    midi.sendShortMsg(0x97+channel,0x58+i,(engine.getValue(group,"hotcue_"+(16+(i*2))+"_position")>-1)?(engine.getValue(group,"hotcue_"+(16+(i*2))+"_position")==engine.getValue(group,"loop_start_position")?0x01:0x7f):0x00);
  }
};

// This handles LEDs related to fx1 ch1 event
PioneerDDJSX2.FX1CH1=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x96,0x4C,value?0x7F:0x00); // Thing
};

// yeah
PioneerDDJSX2.PitchAdjust=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  print("pa");
  if (value!=0) {
    if (value>0) {
      midi.sendShortMsg(0x90+channel,0x4a,0x00);
      midi.sendShortMsg(0x90+channel,0x4b,0x7F);
    } else {
      midi.sendShortMsg(0x90+channel,0x4a,0x7F);
      midi.sendShortMsg(0x90+channel,0x4b,0x00);
    }
  } else {
    midi.sendShortMsg(0x90+channel,0x4a,0x00);
    midi.sendShortMsg(0x90+channel,0x4b,0x00);
  }
};

// *yawn*
PioneerDDJSX2.FX2CH1=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x96,0x50,value?0x7F:0x00); // Thing
};

PioneerDDJSX2.FX1CH2=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x96,0x4D,value?0x7F:0x00); // Thing
};

// ZzZzZz.......
PioneerDDJSX2.FX2CH2=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x96,0x51,value?0x7F:0x00); // Thing
};

PioneerDDJSX2.FX1CH3=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x96,0x4E,value?0x7F:0x00); // Thing
};

//
PioneerDDJSX2.FX2CH3=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x96,0x52,value?0x7F:0x00); // Thing
};

PioneerDDJSX2.FX1CH4=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x96,0x4F,value?0x7F:0x00); // Thing
};

//
PioneerDDJSX2.FX2CH4=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x96,0x53,value?0x7F:0x00); // Thing
};

//
PioneerDDJSX2.CueLeds=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  midi.sendShortMsg(0x90+channel,0x48,value?0x7f:0x00);
  midi.sendShortMsg(0x90+channel,0x0C,value?0x7f:0x00);
};

// *wakes up* keylock event.
PioneerDDJSX2.KeyLockLeds=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x90+channel,0x1A,value?0x7F:0x00); // Keylock LED
};

// This handles the shift thingy
PioneerDDJSX2.Shift=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  PioneerDDJSX2.AreWeInShiftMode=control;
  print(PioneerDDJSX2.AreWeInShiftMode);
};

PioneerDDJSX2.Reverse=function(value, group, control) {
  if (control==127) {  
    PioneerDDJSX2.reverse[value]=!PioneerDDJSX2.reverse[value];
    engine.setValue("[Channel"+(value+1)+"]","reverse",PioneerDDJSX2.reverse[value]);
  }
};

PioneerDDJSX2.AutoLoop=function(channel, control, value, status) {
  if (value==127) {
    if (engine.getValue("[Channel"+(channel+1)+"]","loop_enabled")) {
      engine.setValue("[Channel"+(channel+1)+"]","reloop_exit",1);
    } else {
      engine.setValue("[Channel"+(channel+1)+"]","beatloop_0.25_toggle",1);
    }
  }
};

PioneerDDJSX2.CCC=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  if (control==127) {
    /*
    PioneerDDJSX2.currenteffect[value-4]++;
    if (PioneerDDJSX2.currenteffect[value-4]>3) {
      PioneerDDJSX2.currenteffect[value-4]=0;
    }
    print(value);
    PioneerDDJSX2.CCCLeds();
    */
  }
};

PioneerDDJSX2.CCCLeds=function() {
  // change indicator
  for (var i=0; i<2; i++) {
    for (var j=0; j<3; j++) {
      midi.sendShortMsg(0x94+i,0x47+j,engine.getValue("[EffectRack1_EffectUnit"+(i+1)+"_Effect"+(j+1)+"]","enabled")?0x7F:0x00);
    }
    midi.sendShortMsg(0x94+i,0x4a,engine.getValue("[EffectRack1_EffectUnit"+(i+1)+"]","mix_mode")?0x7F:0x00)
  }
  /*
  midi.sendShortMsg(0x94,0x47,(PioneerDDJSX2.currenteffect[0]==0)?0x7F:0x00);
  midi.sendShortMsg(0x94,0x48,(PioneerDDJSX2.currenteffect[0]==1)?0x7F:0x00);
  midi.sendShortMsg(0x94,0x49,(PioneerDDJSX2.currenteffect[0]==2)?0x7F:0x00);
  midi.sendShortMsg(0x94,0x4a,(PioneerDDJSX2.currenteffect[0]==3)?0x7F:0x00);
  if (PioneerDDJSX2.currenteffect[0]<3) {
    midi.sendShortMsg(0x94,0x63,(PioneerDDJSX2.currenteffectparamset[PioneerDDJSX2.currenteffect[0]]==0)?0x7F:0x00);
    midi.sendShortMsg(0x94,0x64,(PioneerDDJSX2.currenteffectparamset[PioneerDDJSX2.currenteffect[0]]==1)?0x7F:0x00);
    midi.sendShortMsg(0x94,0x65,(PioneerDDJSX2.currenteffectparamset[PioneerDDJSX2.currenteffect[0]]==2)?0x7F:0x00);
    midi.sendShortMsg(0x94,0x66,(PioneerDDJSX2.currenteffectparamset[PioneerDDJSX2.currenteffect[0]]==3)?0x7F:0x00);
  } else {
    midi.sendShortMsg(0x94,0x63,0x7F);
    midi.sendShortMsg(0x94,0x64,0x7F);
    midi.sendShortMsg(0x94,0x65,0x7F);
    midi.sendShortMsg(0x94,0x66,0x7F);
  }
  midi.sendShortMsg(0x95,0x47,(PioneerDDJSX2.currenteffect[1]==0)?0x7F:0x00);
  midi.sendShortMsg(0x95,0x48,(PioneerDDJSX2.currenteffect[1]==1)?0x7F:0x00);
  midi.sendShortMsg(0x95,0x49,(PioneerDDJSX2.currenteffect[1]==2)?0x7F:0x00);
  midi.sendShortMsg(0x95,0x4a,(PioneerDDJSX2.currenteffect[1]==3)?0x7F:0x00);
  if (PioneerDDJSX2.currenteffect[1]<3) {
    midi.sendShortMsg(0x95,0x63,(PioneerDDJSX2.currenteffectparamset[4+PioneerDDJSX2.currenteffect[1]]==0)?0x7F:0x00);
    midi.sendShortMsg(0x95,0x64,(PioneerDDJSX2.currenteffectparamset[4+PioneerDDJSX2.currenteffect[1]]==1)?0x7F:0x00);
    midi.sendShortMsg(0x95,0x65,(PioneerDDJSX2.currenteffectparamset[4+PioneerDDJSX2.currenteffect[1]]==2)?0x7F:0x00);
    midi.sendShortMsg(0x95,0x66,(PioneerDDJSX2.currenteffectparamset[4+PioneerDDJSX2.currenteffect[1]]==3)?0x7F:0x00);
  } else {
    midi.sendShortMsg(0x95,0x63,0x7F);
    midi.sendShortMsg(0x95,0x64,0x7F);
    midi.sendShortMsg(0x95,0x65,0x7F);
    midi.sendShortMsg(0x95,0x66,0x7F);
  }
  if (PioneerDDJSX2.lttimer!=0) {
    engine.stopTimer(PioneerDDJSX2.lttimer);
    PioneerDDJSX2.lttimer=0;
  }*/
};

PioneerDDJSX2.CPS=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  if (control==127) {
    /*
    PioneerDDJSX2.currenteffectparamset[((value==5)?(4):(0))+PioneerDDJSX2.currenteffect[value-4]]++;
    if (PioneerDDJSX2.currenteffectparamset[((value==5)?(4):(0))+PioneerDDJSX2.currenteffect[value-4]]>=(engine.getValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(PioneerDDJSX2.currenteffect[value-4]+1)+"]","num_parameters")/3)) {
      PioneerDDJSX2.currenteffectparamset[((value==5)?(4):(0))+PioneerDDJSX2.currenteffect[value-4]]=0;
    }
    print(PioneerDDJSX2.currenteffectparamset[PioneerDDJSX2.currenteffect[0]]);
    // change indicator
    PioneerDDJSX2.CCCLeds();
    */
  }
};

// This handles selecting effects.
PioneerDDJSX2.EffectSelect=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(group-98)+"]","effect_selector",(control==127)?1:0);
};

// TODO: lotsa' stuff regarding the new effect system.
PioneerDDJSX2.EffectJog=function(value, group, control) {
  if (control>63) {
    engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"]","mix",
      engine.getValue("[EffectRack1_EffectUnit"+(value-3)+"]","mix")-0.0625*(128-control)
    );
  } else {
    engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"]","mix",
      engine.getValue("[EffectRack1_EffectUnit"+(value-3)+"]","mix")+0.0625*(control)
    );
  }
};

PioneerDDJSX2.EffectKnob=function(value, group, control) {
  if (PioneerDDJSX2.currenteffect[value-4]==3) {
    switch (group) {
      case 2:
        engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect1]","meta",control/127);
        break;
      case 4:
        engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect2]","meta",control/127);
        break;
      case 6:
        engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect3]","meta",control/127);
        break;
    }
  } else {
    /*
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
    */
  }
};

PioneerDDJSX2.EffectButton=function(value, group, control) {
  if (control==127) {
    if (PioneerDDJSX2.currenteffect[value-4]==3) {
      engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(group-70)+"]","enabled",
        !engine.getValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(group-70)+"]","enabled")
      );
    } else {
      /*
      if (((PioneerDDJSX2.currenteffectparamset[(4*(value-4))+PioneerDDJSX2.currenteffect[value-4]]*3)+group-71)<engine.getValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(PioneerDDJSX2.currenteffect[value-4]+1)+"]","num_parameters")) {
        PioneerDDJSX2.lt[value-4][PioneerDDJSX2.currenteffect[value-4]][(PioneerDDJSX2.currenteffectparamset[(4*(value-4))+PioneerDDJSX2.currenteffect[value-4]]*3)+group-71]++; if (PioneerDDJSX2.lt[value-4][PioneerDDJSX2.currenteffect[value-4]][(PioneerDDJSX2.currenteffectparamset[(4*(value-4))+PioneerDDJSX2.currenteffect[value-4]]*3)+group-71]>4) {PioneerDDJSX2.lt[value-4][PioneerDDJSX2.currenteffect[value-4]][(PioneerDDJSX2.currenteffectparamset[(4*(value-4))+PioneerDDJSX2.currenteffect[value-4]]*3)+group-71]=0;}
        engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"_Effect"+(PioneerDDJSX2.currenteffect[value-4]+1)+"]","parameter"+((PioneerDDJSX2.currenteffectparamset[(4*(value-4))+PioneerDDJSX2.currenteffect[value-4]]*3)+group-70)+"_link_type",PioneerDDJSX2.lt[value-4][PioneerDDJSX2.currenteffect[value-4]][(PioneerDDJSX2.currenteffectparamset[(4*(value-4))+PioneerDDJSX2.currenteffect[value-4]]*3)+group-71]);
        PioneerDDJSX2.LinkTypeLeds(value-4,PioneerDDJSX2.currenteffect[value-4],(PioneerDDJSX2.currenteffectparamset[(4*(value-4))+PioneerDDJSX2.currenteffect[value-4]]*3)+group-71);
        print(PioneerDDJSX2.lt[value-4][PioneerDDJSX2.currenteffect[value-4]][(PioneerDDJSX2.currenteffectparamset[(4*(value-4))+PioneerDDJSX2.currenteffect[value-4]]*3)+group-71]);
      } else {
        print("ok");   
      }
      */
    }
    PioneerDDJSX2.CCCLeds();
  }
};

PioneerDDJSX2.LinkTypeLeds=function(effectset, effect, param) {
  switch (PioneerDDJSX2.lt[effectset][effect][param]) {
    case 0: // ____
      midi.sendShortMsg(0x94+effectset,0x47,0x00);
      midi.sendShortMsg(0x94+effectset,0x48,0x00);
      midi.sendShortMsg(0x94+effectset,0x49,0x00);
      midi.sendShortMsg(0x94+effectset,0x4a,0x00);
      break;
    case 1: // ----
      midi.sendShortMsg(0x94+effectset,0x47,0x7f);
      midi.sendShortMsg(0x94+effectset,0x48,0x7f);
      midi.sendShortMsg(0x94+effectset,0x49,0x7f);
      midi.sendShortMsg(0x94+effectset,0x4a,0x7f);
      break;
    case 2: // -___
      midi.sendShortMsg(0x94+effectset,0x47,0x7f);
      midi.sendShortMsg(0x94+effectset,0x48,0x00);
      midi.sendShortMsg(0x94+effectset,0x49,0x00);
      midi.sendShortMsg(0x94+effectset,0x4a,0x00);
      break;
    case 3: // ___-
      midi.sendShortMsg(0x94+effectset,0x47,0x00);
      midi.sendShortMsg(0x94+effectset,0x48,0x00);
      midi.sendShortMsg(0x94+effectset,0x49,0x00);
      midi.sendShortMsg(0x94+effectset,0x4a,0x7f);
      break;
    case 4: // -__-
      midi.sendShortMsg(0x94+effectset,0x47,0x7f);
      midi.sendShortMsg(0x94+effectset,0x48,0x00);
      midi.sendShortMsg(0x94+effectset,0x49,0x00);
      midi.sendShortMsg(0x94+effectset,0x4a,0x7f);
      break;
  }
  if (PioneerDDJSX2.lttimer!=0) {
    engine.stopTimer(PioneerDDJSX2.lttimer);
  }
  PioneerDDJSX2.lttimer=engine.beginTimer(2000,"PioneerDDJSX2.CCCLeds",1);
};

PioneerDDJSX2.PanelSelect=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  if (control==127) {
    PioneerDDJSX2.selectedpanel+=((1-(group-120))*2)-1;
    if (PioneerDDJSX2.selectedpanel<0) {
      PioneerDDJSX2.selectedpanel=2;
    }
    if (PioneerDDJSX2.selectedpanel>2) {
      PioneerDDJSX2.selectedpanel=0;
    }
    print(PioneerDDJSX2.selectedpanel);
    switch (PioneerDDJSX2.selectedpanel) {
      case 0:
        engine.setValue("[Samplers]","show_samplers",0);
        engine.setValue("[EffectRack1]","show",0);
        break;
      case 1:
        engine.setValue("[Samplers]","show_samplers",1);
        engine.setValue("[EffectRack1]","show",0);
        break;
      case 2:
        engine.setValue("[Samplers]","show_samplers",0);
        engine.setValue("[EffectRack1]","show",1);
        break;
    }
  }
};

PioneerDDJSX2.ViewButton=function(value, group, control) {
  if (control==127) {
    PioneerDDJSX2.selectedview++;
    if (PioneerDDJSX2.selectedview>7) {
      PioneerDDJSX2.selectedpanel=0;
    }
    print(PioneerDDJSX2.selectedview);
    engine.setValue("[Master]","show_4decks",PioneerDDJSX2.selectedview&1);
    engine.setValue("[Deere]","show_stacked_waveforms",PioneerDDJSX2.selectedview&2);
    engine.setValue("[Master]","hide_mixer",PioneerDDJSX2.selectedview&4);
  }
};

PioneerDDJSX2.EffectTap=function(value, group, control) {
  //var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  if (control==127) {
    if (PioneerDDJSX2.currenteffect[value-4]==3) {
      engine.setValue("[EffectRack1_EffectUnit"+(value-3)+"]","mix_mode",
        !engine.getValue("[EffectRack1_EffectUnit"+(value-3)+"]","mix_mode")
      );
      PioneerDDJSX2.CCCLeds();
    }
  }
};

PioneerDDJSX2.SetGridSlide=function(value, group, control) {
  PioneerDDJSX2.gridSlide[value]=control?1:0;
  midi.sendShortMsg(0x90+value,0x0a,control?0x7F:0x00);
};

PioneerDDJSX2.SetGridAdjust=function(value, group, control) {
  PioneerDDJSX2.gridAdjust[value]=control?1:0;
  midi.sendShortMsg(0x90+value,0x79,control?0x7F:0x00);
};

PioneerDDJSX2.ClearGrid=function(value, group, control) {
  print("this is impossible");
  midi.sendShortMsg(0x90+value,0x79,control?0x7F:0x00);
};

// This handles LEDs related to the play event.
PioneerDDJSX2.PlayLeds=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];  
  midi.sendShortMsg(0x90+channel,0x0B,value?0x7F:0x00); // Play/Pause LED
  midi.sendShortMsg(0x90+channel,0x47,value?0x7F:0x00); // Shift Play/Pause LED
  if (PioneerDDJSX2.settings.DoNotTrickController) {
    midi.sendShortMsg(0x9B,0x0c+channel,value?0x7F:0x00); // play/pause animation
  }
};

PioneerDDJSX2.SetHotCueMode=function(group, control, value, status) {
  if (value==127) {
    print("HOT CUE");
    PioneerDDJSX2.PadMode[group]=0;
    midi.sendShortMsg(0x90+group,0x1b,0x7f);
  }
};

PioneerDDJSX2.SetRollMode=function(group, control, value, status) {
  if (value==127) {
    print("ROLL");
    PioneerDDJSX2.PadMode[group]=1;
    midi.sendShortMsg(0x90+group,0x1e,PioneerDDJSX2.settings.rollColors[PioneerDDJSX2.rollPrec[group]]);
  }
};

PioneerDDJSX2.SetSlicerMode=function(group, control, value, status) {
  if (value==127) {
    print("SLICER");
    PioneerDDJSX2.PadMode[group]=2;
    midi.sendShortMsg(0x90+group,0x20,0x7f);
    // update slicer lights
    PioneerDDJSX2.beat[group]=Math.round(engine.getValue("[Channel"+(group+1)+"]","beat_next")/engine.getValue("[Channel"+(group+1)+"]","track_samplerate")*(engine.getValue("[Channel"+(group+1)+"]","file_bpm")/120.0))-1;
    print("beat "+engine.getValue("[Channel"+(group+1)+"]","beat_closest"));
    midi.sendShortMsg(0x97+group,0x20,((Math.floor(PioneerDDJSX2.beat[group]%8))==0)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x21,((Math.floor(PioneerDDJSX2.beat[group]%8))==1)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x22,((Math.floor(PioneerDDJSX2.beat[group]%8))==2)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x23,((Math.floor(PioneerDDJSX2.beat[group]%8))==3)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x24,((Math.floor(PioneerDDJSX2.beat[group]%8))==4)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x25,((Math.floor(PioneerDDJSX2.beat[group]%8))==5)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x26,((Math.floor(PioneerDDJSX2.beat[group]%8))==6)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x27,((Math.floor(PioneerDDJSX2.beat[group]%8))==7)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x28,((Math.floor(PioneerDDJSX2.beat[group]%8))==0)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x29,((Math.floor(PioneerDDJSX2.beat[group]%8))==1)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x2a,((Math.floor(PioneerDDJSX2.beat[group]%8))==2)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x2b,((Math.floor(PioneerDDJSX2.beat[group]%8))==3)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x2c,((Math.floor(PioneerDDJSX2.beat[group]%8))==4)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x2d,((Math.floor(PioneerDDJSX2.beat[group]%8))==5)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x2e,((Math.floor(PioneerDDJSX2.beat[group]%8))==6)?0x01:0x28);
    midi.sendShortMsg(0x97+group,0x2f,((Math.floor(PioneerDDJSX2.beat[group]%8))==7)?0x01:0x28);
  }
};

PioneerDDJSX2.SetSamplerMode=function(group, control, value, status) {
  if (value==127) {
    print("SAMPLER");
    PioneerDDJSX2.PadMode[group]=3;
    midi.sendShortMsg(0x90+group,0x22,0x7f);
  }
};

PioneerDDJSX2.SetCueLoopMode=function(group, control, value, status) {
  if (value==127) {
    print("cue loop");
    PioneerDDJSX2.PadMode[group]=4;
    midi.sendShortMsg(0x90+group,0x69,PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[group]]);
    PioneerDDJSX2.UpdateCueLoopLights(group);
  }
};

PioneerDDJSX2.SetSavedLoopMode=function(group, control, value, status) {
  if (value==127) {
    print("saved loop");
    PioneerDDJSX2.PadMode[group]=5;
    midi.sendShortMsg(0x90+group,0x6b,0x7f);
  }
};

PioneerDDJSX2.SetSlicerLoopMode=function(group, control, value, status) {
  if (value==127) {
    print("slicer loop");
    PioneerDDJSX2.PadMode[group]=6;
    midi.sendShortMsg(0x90+group,0x6d,0x7f);
    // update slicer loop lights
    PioneerDDJSX2.beat[group]=Math.round(engine.getValue("[Channel"+(group+1)+"]","beat_next")/engine.getValue("[Channel"+(group+1)+"]","track_samplerate")*(engine.getValue("[Channel"+(group+1)+"]","file_bpm")/120.0))-1;
    print("beat "+engine.getValue("[Channel"+(group+1)+"]","beat_closest"));
    midi.sendShortMsg(0x97+group,0x60,((Math.floor(PioneerDDJSX2.beat[group]%8))==0)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x61,((Math.floor(PioneerDDJSX2.beat[group]%8))==1)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x62,((Math.floor(PioneerDDJSX2.beat[group]%8))==2)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x63,((Math.floor(PioneerDDJSX2.beat[group]%8))==3)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x64,((Math.floor(PioneerDDJSX2.beat[group]%8))==4)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x65,((Math.floor(PioneerDDJSX2.beat[group]%8))==5)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x66,((Math.floor(PioneerDDJSX2.beat[group]%8))==6)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x67,((Math.floor(PioneerDDJSX2.beat[group]%8))==7)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x68,((Math.floor(PioneerDDJSX2.beat[group]%8))==0)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x69,((Math.floor(PioneerDDJSX2.beat[group]%8))==1)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x6a,((Math.floor(PioneerDDJSX2.beat[group]%8))==2)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x6b,((Math.floor(PioneerDDJSX2.beat[group]%8))==3)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x6c,((Math.floor(PioneerDDJSX2.beat[group]%8))==4)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x6d,((Math.floor(PioneerDDJSX2.beat[group]%8))==5)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x6e,((Math.floor(PioneerDDJSX2.beat[group]%8))==6)?0x28:0x01);
    midi.sendShortMsg(0x97+group,0x6f,((Math.floor(PioneerDDJSX2.beat[group]%8))==7)?0x28:0x01);
  }
};

PioneerDDJSX2.SetVelocitySamplerMode=function(group, control, value, status) {
  if (value==127) {
    print("velocity sampler");
    PioneerDDJSX2.PadMode[group]=7;
    midi.sendShortMsg(0x90+group,0x6f,0x7f);
  }
};

PioneerDDJSX2.SamplerPlay=function(group, control, value, status) {
  engine.setParameter("[Sampler"+(1+(control&7)+(PioneerDDJSX2.samplerBank[group-7]*8))+"]","start_play",value&1);
};

PioneerDDJSX2.SamplerStop=function(group, control, value, status) {
  engine.setParameter("[Sampler"+(1+(control&7)+(PioneerDDJSX2.samplerBank[group-7]*8))+"]","start_stop",value&1);
};

PioneerDDJSX2.SetSampleGain=function(group, control, value) {
  var where=(control&7)+(PioneerDDJSX2.samplerBank[group-7]*8);
  PioneerDDJSX2.sampleVolume[where]=value/127;
  engine.setParameter("[Sampler"+(1+where)+"]","pregain",PioneerDDJSX2.samplerVolume*PioneerDDJSX2.sampleVolume[where]);
};

PioneerDDJSX2.SetSamplerVol=function(value, group, control) {
  print("setting");
  PioneerDDJSX2.samplerVolume=control/127;
  // to be raised to 64 for 2.1
  for (var i=0; i<16; i++) {
    engine.setParameter("[Sampler"+(i+1)+"]","pregain",PioneerDDJSX2.samplerVolume*PioneerDDJSX2.sampleVolume[i]);
  }
};

PioneerDDJSX2.SetTempoRange=function(group, control, value, status) {
  if (value==127) {
    PioneerDDJSX2.tempoRange[group]++;
    if (PioneerDDJSX2.tempoRange[group]>3) {
      PioneerDDJSX2.tempoRange[group]=0;
    }
    print("setting tr "+PioneerDDJSX2.tempoRange[group]);
    engine.setParameter("[Channel"+(group+1)+"]","rateRange",PioneerDDJSX2.settings.tempoRanges[PioneerDDJSX2.tempoRange[group]]);
  }
};

PioneerDDJSX2.ToggleVinyl=function(group, control, value, status) {
  if (value==127) {
    PioneerDDJSX2.vinylOn[group]=!PioneerDDJSX2.vinylOn[group];
    print("tv");
  }
};

PioneerDDJSX2.RollParam1L=function(group, control, value, status) {
  if (value==127) {
    print("rp1l"+group);
    PioneerDDJSX2.rollPrec[group]--;
    if (PioneerDDJSX2.rollPrec[group]<0) {
      PioneerDDJSX2.rollPrec[group]=0;
    }
    print("new rp: "+PioneerDDJSX2.rollPrec[group]);
    midi.sendShortMsg(0x90+group,0x1e,PioneerDDJSX2.settings.rollColors[PioneerDDJSX2.rollPrec[group]]);
  }
};

PioneerDDJSX2.RollParam1R=function(group, control, value, status) {
  if (value==127) {
    print("rp1r"+group);
    PioneerDDJSX2.rollPrec[group]++;
    if (PioneerDDJSX2.rollPrec[group]>4) {
      PioneerDDJSX2.rollPrec[group]=4;
    }
    print("new rp: "+PioneerDDJSX2.rollPrec[group]);
    midi.sendShortMsg(0x90+group,0x1e,PioneerDDJSX2.settings.rollColors[PioneerDDJSX2.rollPrec[group]]);
  }
};

PioneerDDJSX2.RepaintSampler=function(group) {
  var ai;
  print("RepaintSampler "+group);
  for (var i=0; i<8; i++) {
    ai=i+PioneerDDJSX2.samplerBank[group]*8;
    if (engine.getValue("[Sampler"+(ai+1)+"]","track_samples")>0) {
      midi.sendShortMsg(0x97+group,0x30+i,0x7f);
      midi.sendShortMsg(0x97+group,0x70+i,0x7f);
      midi.sendShortMsg(0x97+group,0x38+i,0x7f);
      midi.sendShortMsg(0x97+group,0x78+i,0x7f);
    } else {
      midi.sendShortMsg(0x97+group,0x30+i,0x00);
      midi.sendShortMsg(0x97+group,0x70+i,0x00);
      midi.sendShortMsg(0x97+group,0x38+i,0x00);
      midi.sendShortMsg(0x97+group,0x78+i,0x00);
    }
  }
};

PioneerDDJSX2.SamplerParam1L=function(group, control, value, status) {
  if (value==127) {
    PioneerDDJSX2.samplerBank[group]--;
    if (PioneerDDJSX2.samplerBank[group]<0) {
      PioneerDDJSX2.samplerBank[group]=0;
    } else {
      PioneerDDJSX2.RepaintSampler(group);
    }
  }
};

PioneerDDJSX2.SamplerParam1R=function(group, control, value, status) {
  if (value==127) {
    PioneerDDJSX2.samplerBank[group]++;
    if (PioneerDDJSX2.samplerBank[group]>3) {
      PioneerDDJSX2.samplerBank[group]=3;
    } else {
      PioneerDDJSX2.RepaintSampler(group);
    }
  }
};

PioneerDDJSX2.CueLoopParam1L=function(group, control, value, status) {
  if (value==127) {
    print("clp1l"+group);
    PioneerDDJSX2.hclPrec[group]--;
    if (PioneerDDJSX2.hclPrec[group]<0) {
      PioneerDDJSX2.hclPrec[group]=0;
    } else {
      if (PioneerDDJSX2.HCLOn[group]) {
        print("must halve");
        engine.setValue("[Channel"+(group+1)+"]",'loop_halve',1);
      }
    }
    print("new hclp: "+PioneerDDJSX2.hclPrec[group]);
    midi.sendShortMsg(0x90+group,0x69,PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[group]]);
    PioneerDDJSX2.UpdateCueLoopLights(group);
  } else {
    if (PioneerDDJSX2.HCLOn[group]) {
      print("must halve");
      engine.setValue("[Channel"+(group+1)+"]",'loop_halve',0);
    }
  }
};

PioneerDDJSX2.CueLoopParam1R=function(group, control, value, status) {
  if (value==127) {
    print("clp1r"+group);
    PioneerDDJSX2.hclPrec[group]++;
    if (PioneerDDJSX2.hclPrec[group]>11) {
      PioneerDDJSX2.hclPrec[group]=11;
    } else {
      if (PioneerDDJSX2.HCLOn[group]) {
        print("must double");
        engine.setValue("[Channel"+(group+1)+"]",'loop_double',1);
      }
    }
    print("new hclp: "+PioneerDDJSX2.hclPrec[group]);
    midi.sendShortMsg(0x90+group,0x69,PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[group]]);
    PioneerDDJSX2.UpdateCueLoopLights(group);
  } else {
    if (PioneerDDJSX2.HCLOn[group]) {
      print("must double");
      engine.setValue("[Channel"+(group+1)+"]",'loop_double',0);
    }
  }
};

// Lights up the LEDs for beat-loops.
PioneerDDJSX2.RollPerformancePadLed=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  
  var padIndex=0;
  for (var i=0; i<8; i++) {
    if (control==='beatloop_'+PioneerDDJSX2.settings.loopIntervals[i+2]+'_enabled') {
      break;
    }
    padIndex++;
  }
  if (engine.getValue('[Channel1]','play')==true) {
    // Toggle the relevant Performance Pad LED
    midi.sendShortMsg(0x97+channel,0x10+padIndex,value?0x7F:0x00);
  }
};

PioneerDDJSX2.UpdateCueLoopLights=function(channel) {
  for (var i=0; i<8; i++) {
    if (engine.getValue("[Channel"+(channel+1)+"]",'hotcue_'+(i+1)+'_enabled')) {
      // Loop Pad LED without shift key
      midi.sendShortMsg(0x97+channel,0x40+i,(PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[channel]]));
      // Loop Pad LED with shift key
      midi.sendShortMsg(0x97+channel,0x40+i+0x08,(PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[channel]]));
    } else {
      // Loop Pad LED without shift key
      midi.sendShortMsg(0x97+channel,0x40+i,0);
      // Loop Pad LED with shift key
      midi.sendShortMsg(0x97+channel,0x40+i+0x08,0);
    }
  }
}

PioneerDDJSX2.HotCuePerformancePadLed=function(value, group, control) {
  var channel=PioneerDDJSX2.enumerations.channelGroups[group];
  
  var padIndex=null;
        
  for (var i=1; i<9; i++) {
    if (control==='hotcue_'+i+'_enabled') {
      // Pad LED without shift key
      midi.sendShortMsg(0x97+channel,0x00+i-1,value?PioneerDDJSX2.settings.hotCueColors[i-1]:0x00);
      // Pad LED with shift key
      midi.sendShortMsg(0x97+channel,0x00+i-1+0x08,value?PioneerDDJSX2.settings.hotCueColors[i-1]:0x00);
      // Loop Pad LED without shift key
      midi.sendShortMsg(0x97+channel,0x40+i-1,value?(PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[channel]]):0x00);  
      // Loop Pad LED with shift key
      midi.sendShortMsg(0x97+channel,0x40+i-1+0x08,value?(PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[channel]]):0x00);
    }
    padIndex=i;
  }
};

// Set the VU meter levels.
PioneerDDJSX2.vuMeter=function(value, group, control) {
  // VU meter range is 0 to 127 (or 0x7F).
  var level=value*127;
  var channel=null;
  switch (group) {
    case '[Channel1]': 
      channel=0xB0;
      break;
    case '[Channel2]': 
      channel=0xB1;
      break;
    case '[Channel3]': 
      channel=0xB2;
      break;
    case '[Channel4]': 
      channel=0xB3;
      break;
  }
  
  midi.sendShortMsg(channel,0x02,level);
}

// Work out the jog-wheel change/delta
PioneerDDJSX2.getJogWheelDelta=function(value) {
  // The Wheel control centers on 0x40; find out how much it's moved by.
  return value-0x40;
}

// Toggle scratching for a channel
PioneerDDJSX2.toggleScratch=function(channel, isEnabled) {
  var deck=channel+1;
  if (isEnabled) {
    engine.scratchEnable(deck,PioneerDDJSX2.settings.jogResolution,PioneerDDJSX2.settings.vinylSpeed,PioneerDDJSX2.settings.alpha,PioneerDDJSX2.settings.beta);
  } else {
    engine.scratchDisable(deck);
  }
};

// Pitch bend a channel
PioneerDDJSX2.pitchBend=function(channel, movement) {
  var deck=channel+1;
  var group='[Channel'+deck+']';
  
  // Make this a little less sensitive.
  movement=movement/5; 
  // Limit movement to the range of -3 to 3.
  movement=movement>3?3:movement;
  movement=movement<-3?-3:movement;
  
  engine.setValue(group,'jog',movement);  
};

// Schedule disabling scratch. We don't do this immediately on 
// letting go of the jog wheel,as that result in a pitch-bend.
// Instead,we set up a time that disables it,but cancel and
// re-register that timer whenever we need to to postpone the disable.
// Very much a hack,but it works,and I'm yet to find a better solution.
PioneerDDJSX2.scheduleDisableScratch=function(channel) {
  PioneerDDJSX2.channels[channel].disableScratchTimer=engine.beginTimer(PioneerDDJSX2.settings.safeScratchTimeout,'PioneerDDJSX2.toggleScratch('+channel+',false)',true);
};

// If scratch-disabling has been schedule,then unschedule it.
PioneerDDJSX2.unscheduleDisableScratch=function(channel) {
  if (PioneerDDJSX2.channels[channel].disableScratchTimer) {
    engine.stopTimer(PioneerDDJSX2.channels[channel].disableScratchTimer);
  }
};

// Postpone scratch disabling by a few milliseconds. This is
// useful if you were scratching,but let of of the jog wheel.
// Without this,you'd end up with a pitch-bend in that case.
PioneerDDJSX2.postponeDisableScratch=function(channel) {
  PioneerDDJSX2.unscheduleDisableScratch(channel);
  PioneerDDJSX2.scheduleDisableScratch(channel);
};

// Detect when the user touches and releases the jog-wheel while 
// jog-mode is set to vinyl to enable and disable scratching.
PioneerDDJSX2.jogScratchTouch=function(channel, control, value, status) {
  if (value==0x7F && PioneerDDJSX2.vinylOn[channel]) {
    PioneerDDJSX2.unscheduleDisableScratch(channel);  
    PioneerDDJSX2.toggleScratch(channel,true);
  } else {
    PioneerDDJSX2.scheduleDisableScratch(channel);
  }
};

PioneerDDJSX2.jogSeek=function(channel, control, value, status) {
  print("seek "+PioneerDDJSX2.getJogWheelDelta(value));
  engine.setValue("[Channel"+(channel+1)+"]","beatjump",PioneerDDJSX2.getJogWheelDelta(value)/16);
};
 
// Scratch or seek with the jog-wheel.
PioneerDDJSX2.jogScratchTurn=function(channel, control, value, status) {
  var deck=channel+1; 
  // Only scratch if we're in scratching mode,when 
  // user is touching the top of the jog-wheel.
  if (engine.isScratching(deck) && !PioneerDDJSX2.gridSlide[channel] && !PioneerDDJSX2.gridAdjust[channel]) {
    engine.scratchTick(deck,PioneerDDJSX2.getJogWheelDelta(value));
  } else {
    if (PioneerDDJSX2.gridSlide[channel]) {
      if (value<64) {
        engine.setValue("[Channel"+deck+"]","beats_translate_earlier",1);
      } else {
        engine.setValue("[Channel"+deck+"]","beats_translate_later",1);
      }
      print(value);
    }
    if (PioneerDDJSX2.gridAdjust[channel]) {
      if (value<64) {
        engine.setValue("[Channel"+deck+"]","beats_adjust_faster",1);
      } else {
        engine.setValue("[Channel"+deck+"]","beats_adjust_slower",1);
      }
      print(value);
    }
  }
};

// Pitch bend using the jog-wheel,or finish a scratch when the wheel 
// is still turning after having released it.
PioneerDDJSX2.jogPitchBend=function(channel, control, value, status) {
  var deck=channel+1; 
  var group='[Channel'+deck+']';

  if (engine.isScratching(deck)) {
    engine.scratchTick(deck,PioneerDDJSX2.getJogWheelDelta(value));
    PioneerDDJSX2.postponeDisableScratch(channel);
  } else {  
    // Only pitch-bend when actually playing
    if (engine.getValue(group,'play')) {
      PioneerDDJSX2.pitchBend(channel,PioneerDDJSX2.getJogWheelDelta(value));
    }
  }
};

// Called when the jog-mode is not set to vinyl,and the jog wheel is touched.
PioneerDDJSX2.jogSeekTouch=function(channel, control, value, status) {
  var deck=channel+1; 
  var group='[Channel'+deck+']';
  
  // Only enable scratching if we're in scratching mode,when user is  
  // touching the top of the jog-wheel and the 'Vinyl' jog mode is 
  // selected.
  if (!engine.getValue(group,'play')) {
    // Scratch if we're not playing; otherwise we'll be 
    // pitch-bending here,which we don't want.
    PioneerDDJSX2.toggleScratch(channel,value==0x7F);
  }
};

// Call when the jog-wheel is turned. The related jogSeekTouch function 
// sets up whether we will be scratching or pitch-bending depending 
// on whether a song is playing or not.
PioneerDDJSX2.jogSeekTurn=function(channel, control, value, status) {
  var deck=channel+1; 
  if (engine.isScratching(deck)) {
    engine.scratchTick(deck,PioneerDDJSX2.getJogWheelDelta(value));
  } else {
    PioneerDDJSX2.pitchBend(channel,PioneerDDJSX2.getJogWheelDelta(value));
  }
};

// This handles the eight performance pads below the jog-wheels 
// that deal with the slicer. I took ages to make this. And still making.
PioneerDDJSX2.SlicerThing=function(performanceChannel, control, value, status) {
  var deck=performanceChannel-7;  
  var group='[Channel'+(deck+1)+']';
    
  if (value==0x7F && engine.getValue(group,"play") && engine.getValue(group,"bpm")>0) {
    if (!PioneerDDJSX2.slicersched[deck]) {
      PioneerDDJSX2.slicersched[deck]=1;
      PioneerDDJSX2.slicerbutton[deck]=(control-32)%8;
      print("slicer scheduled: "+PioneerDDJSX2.slicerbutton[deck]);
    } else {
      print("slicer already scheduled,not doing anything");
    }
  }
};

// This handles the eight performance pads below the jog-wheels 
// that deal with rolls or beat loops.
PioneerDDJSX2.RollPerformancePad=function(performanceChannel, control, value, status) {
  var deck=performanceChannel-6;  
  var group='[Channel'+deck+']';
  var interval=PioneerDDJSX2.settings.loopIntervals[control-0x10+PioneerDDJSX2.rollPrec[performanceChannel-7]];
        
  if (value==0x7F) {
    engine.setValue(group,'beatlooproll_'+interval+'_activate',1);
  } else {
    engine.setValue(group,'beatlooproll_'+interval+'_activate',0);
  }
  
  midi.sendShortMsg(0x97+deck-1,control,(value==0x7f)?(PioneerDDJSX2.settings.rollColors[PioneerDDJSX2.rollPrec[performanceChannel-7]]):(0x00));
};

// This handles the cue loop thingy.
PioneerDDJSX2.HotCueLoop=function(performanceChannel, control, value, status) {
  var deck=performanceChannel-7;  
  var group='[Channel'+(deck+1)+']';
  print(deck);
  //var interval=PioneerDDJSX2.settings.loopIntervals[control-0x40+2];
        
  if (value==0x7F) {
    if (!PioneerDDJSX2.HCLOn[deck] || control>=0x48 || PioneerDDJSX2.HCLNum[deck]!=(control&0x7)) {
      engine.setValue(group,'hotcue_'+(1+(control&0x7))+'_activate',1);
      engine.setValue(group,'loop_start_position',engine.getValue(group,'hotcue_'+(1+(control&0x7))+'_position'));
      engine.setValue(group,'loop_end_position',engine.getValue(group,'hotcue_'+(1+(control&0x7))+'_position')+engine.getValue(group,'track_samplerate')*(120/engine.getValue(group,'file_bpm'))*PioneerDDJSX2.settings.loopIntervals[PioneerDDJSX2.hclPrec[deck]]);
      if (!engine.getValue(group,'loop_enabled')) {
        // workaround
        engine.setValue(group,'reloop_exit',1);
        engine.setValue(group,'reloop_exit',0);
      }
      if (PioneerDDJSX2.HCLOn[deck]) {
        midi.sendShortMsg(0x97+deck,0x40+PioneerDDJSX2.HCLNum[deck],PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[deck]]);
        midi.sendShortMsg(0x97+deck,0x48+PioneerDDJSX2.HCLNum[deck],PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[deck]]);
      }
      PioneerDDJSX2.HCLOn[deck]=1;
      PioneerDDJSX2.HCLNum[deck]=(control&0x7);
    } else {
      if (engine.getValue(group,'loop_enabled')) {
        // workaround
        engine.setValue(group,'reloop_exit',1);
        engine.setValue(group,'reloop_exit',0);
      }
      PioneerDDJSX2.HCLOn[deck]=0;
      midi.sendShortMsg(0x97+deck,0x40+PioneerDDJSX2.HCLNum[deck],PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[deck]]);
      midi.sendShortMsg(0x97+deck,0x48+PioneerDDJSX2.HCLNum[deck],PioneerDDJSX2.settings.cueLoopColors[PioneerDDJSX2.hclPrec[deck]]);
    }
  }
};

// This handles saving loops.
PioneerDDJSX2.SavedLoop=function(performanceChannel, control, value, status) {
  var deck=performanceChannel-6;
  var group='[Channel'+deck+']';
  
  if (value==0x7F) {
    if (engine.getValue(group,"hotcue_"+((control-0x48)*2)+"_position")==-1) {
      if (engine.getValue(group,"loop_start_position")!=-1 && engine.getValue(group,"loop_end_position")!=-1) {
        engine.setValue(group,"hotcue_"+((control-0x48)*2)+"_set",1);
        engine.setValue(group,"hotcue_"+(((control-0x48)*2)+1)+"_set",1);
        engine.setValue(group,"hotcue_"+((control-0x48)*2)+"_position",engine.getValue(group,"loop_start_position"));
        engine.setValue(group,"hotcue_"+(((control-0x48)*2)+1)+"_position",engine.getValue(group,"loop_end_position"));
        print("make true");
      }
    } else {
      print("retrieve loop");
      engine.setValue(group,"loop_start_position",engine.getValue(group,"hotcue_"+((control-0x48)*2)+"_position"));
      engine.setValue(group,"loop_end_position",engine.getValue(group,"hotcue_"+(((control-0x48)*2)+1)+"_position"));
      engine.setValue(group,"reloop_exit",1);
    }
  }
};

// This handles saving loops.
PioneerDDJSX2.ClearSavedLoop=function(performanceChannel, control, value, status) {
  var deck=performanceChannel-6;
  var group='[Channel'+deck+']';
        
  if (value==0x7F) {
    print("ok");
    print(((control-0x50)*2));
    engine.setValue(group,"hotcue_"+((control-0x50)*2)+"_clear",1);
    engine.setValue(group,"hotcue_"+(((control-0x50)*2)+1)+"_clear",1);
  }
};

// Handles the rotary selector for choosing tracks,library items,crates,etc.
PioneerDDJSX2.RotarySelector=function(channel, control, value, status) {
  var delta=0x40-Math.abs(0x40-value);
  var isCounterClockwise=value>0x40;
  if (isCounterClockwise) {
    delta*=-1;
  }
  
  var tracklist=PioneerDDJSX2.enumerations.rotarySelector.targets.tracklist;
  var libraries=PioneerDDJSX2.enumerations.rotarySelector.targets.libraries;
  
  switch (PioneerDDJSX2.status.rotarySelector.target) {
    case tracklist:
      engine.setValue('[Playlist]','SelectTrackKnob',delta);
      break;
    case libraries:
      if (delta>0) {
        engine.setValue('[Playlist]','SelectNextPlaylist',1);
      } else if (delta<0) {
        engine.setValue('[Playlist]','SelectPrevPlaylist',1);
      }
      break;
  }
};

PioneerDDJSX2.BackButton=function(channel, control, value, status) {
  if (value==0x7F) {
    PioneerDDJSX2.status.rotarySelector.target=PioneerDDJSX2.enumerations.rotarySelector.targets.libraries;
  }
};

PioneerDDJSX2.RotarySelectorClick=function(channel, control, value, status) {
  // Only trigger when the button is pressed down,not when it comes back up.
  if (value==0x7F) {
    var target=PioneerDDJSX2.enumerations.rotarySelector.targets.tracklist;
    
    var tracklist=PioneerDDJSX2.enumerations.rotarySelector.targets.tracklist;
    var libraries=PioneerDDJSX2.enumerations.rotarySelector.targets.libraries;
    
    switch (PioneerDDJSX2.status.rotarySelector.target) {
      case tracklist:
        target=libraries;
        break;
      case libraries:
        target=tracklist;
        break;
    }
    
    PioneerDDJSX2.status.rotarySelector.target=target;
  }
};

PioneerDDJSX2.shutdown=function() {
  //PioneerDDJSX2.BindControlConnections(true);
  
  // disable VU meters
  PioneerDDJSX2.vuMeter(0,'[Channel1]','VuMeter');
  PioneerDDJSX2.vuMeter(0,'[Channel2]','VuMeter');
  PioneerDDJSX2.vuMeter(0,'[Channel3]','VuMeter');
  PioneerDDJSX2.vuMeter(0,'[Channel4]','VuMeter');
  
  // disable decks
  midi.sendShortMsg(0xbb,0,0);
  midi.sendShortMsg(0xbb,1,0);
  midi.sendShortMsg(0xbb,2,0);
  midi.sendShortMsg(0xbb,3,0);
  midi.sendShortMsg(0xbb,4,0);
  midi.sendShortMsg(0xbb,5,0);
  midi.sendShortMsg(0xbb,6,0);
  midi.sendShortMsg(0xbb,7,0);
  // disable timer
  engine.stopTimer(PioneerDDJSX2.lightsTimer);
};
