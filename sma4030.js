const fz = require('zigbee-herdsman-converters/converters/fromZigbee');
const exposes = require('zigbee-herdsman-converters/lib/exposes');
const e = exposes.presets;

const tzLocal = {
    light_onoff_brightness_colortemp: {
        key: ['state', 'brightness', 'color_temp'],
        async convertSet(entity, key, value, meta) {
            const state = {};
            if (key === 'state') {
                await entity.command('genOnOff', value.toLowerCase(), {}, {});
                state.state = value;
            } else if (key === 'brightness') {
                await entity.command('genLevelCtrl', 'moveToLevel', {level: value, transtime: 0}, {});
                state.brightness = value;
            } else if (key === 'color_temp') {
                await entity.command('lightingColorCtrl', 'moveToColorTemp', {colortemp: value, transtime: 0}, {});
                state.color_temp = value;
            }
            return {state};
        },
        async convertGet(entity, key, meta) {
            if (key === 'state') {
                await entity.read('genOnOff', ['onOff']);
            } else if (key === 'brightness') {
                await entity.read('genLevelCtrl', ['currentLevel']);
            } else if (key === 'color_temp') {
                await entity.read('lightingColorCtrl', ['colorTemperature']);
            }
        }
    }
};

const definition = {
    fingerprint: [
        {modelID: 'ZLL-ColorTemperature', manufacturerName: 'Cupower'}
    ],
    model: 'ZLL-ColorTemperature',
    vendor: 'Cupower',
    description: 'Cupower Mercator Smart RGB+CCT Downlight (Legacy ZLL Mode)',
    exposes: [
        e.light().withBrightness().withColorTemp([166, 454]),
    ],
    fromZigbee: [
        fz.on_off,
        fz.brightness,
        fz.color_colortemp,
    ],
    toZigbee: [
        tzLocal.light_onoff_brightness_colortemp,
    ],
};

module.exports = definition;
