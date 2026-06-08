# Mercator Smart Cloud SMA4030 Zigbee2MQTT Converter

This repository contains the custom Zigbee2MQTT (Z2M) external converter and integration documentation for the **Mercator Smart Cloud SMA4030 30W LED Downlight** / **SH-IB30L32A-L 30W Dual CH Driver Box**.

## Device Profile
* **Product Model:** Mercator Smart Cloud SMA4030 (30W LED Ceiling Light / Downlight)
* **Driver Box Model:** SH-IB30L32A-L (30W Dual CH Driver Box)
* **Reported Manufacturer:** Cupower (OEM LED driver manufacturer)
* **Model ID:** `ZLL-ColorTemperature`
* **Firmware Version:** `1.4 (r16101302)` (Legacy 2016-era Zigbee Light Link firmware)
* **Supported Features:** State (On/Off), Brightness, Color Temperature (CCT, mired range `[166, 454]`)

---

## The Legacy Compatibility Challenge

This driver uses a legacy **Zigbee Light Link (ZLL)** firmware version from 2016. Because of this, it ignores standard modern Zigbee2MQTT brightness and CCT commands:
1. **Zigbee 3.0 Metadata Headers:** The default Z2M modern extends include Zigbee 3.0 optional properties (e.g. options mask, execution flags) which fail to parse in the device's legacy MCU.
2. **Transition Time Parameter:** The underlying `zigbee-herdsman` library expects the transition time payload parameter to be named **`transtime`** (instead of `transitiontime`). 

### Solution
The custom converter in this repository intercepts outbound MQTT actions and dispatches raw, clean ZCL command payloads directly to clusters `genLevelCtrl` and `lightingColorCtrl` with only the mandatory properties and `transtime: 0`.

---

## Installation

1. Copy the [`sma4030.js`](sma4030.js) file from this repository to your Zigbee2MQTT external converters directory (e.g., `/config/zigbee2mqtt/external_converters/sma4030.js` on Home Assistant).
2. Open your Zigbee2MQTT `configuration.yaml` and reference the external converter:
   ```yaml
   external_converters:
     - sma4030.js
   ```
3. Restart the Zigbee2MQTT addon/service.

---

## Pairing Procedure

To reset and put the Mercator driver box into pairing mode:
1. Turn the physical wall switch or mains power **OFF**.
2. Turn the power **ON and OFF 3 times** in quick succession.
3. The light will pulse or flash slowly, indicating it is searching for a coordinator.
4. Enable pairing mode in Zigbee2MQTT (Join / Permit Join).

---

## Custom Device Icon in Zigbee2MQTT

To use the custom device image [`sma4030.png`](sma4030.png) in the Zigbee2MQTT frontend:
1. Create a folder named `device_icons` inside your Zigbee2MQTT data configuration directory (e.g., `/config/zigbee2mqtt/device_icons/` on Home Assistant).
2. Copy the [`sma4030.png`](sma4030.png) image into that folder.
3. Open the Zigbee2MQTT Frontend in your browser.
4. Click on your paired Mercator device, select the **Settings** tab.
5. In the **Icon** field, enter `device_icons/sma4030.png` and save.


