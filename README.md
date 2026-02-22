
#  Pixel Video – Retro Webcam Filter

Pixel Video is a real-time retro webcam filter built using **HTML5 Canvas** and **Vanilla JavaScript**. It captures live footage and transforms it into nostalgic pixel art using classic color palettes like Gameboy, NES, Atari, and Cyberpunk. This was made using only frontend no backend.

---

##  Features

*  **Live Capture:** Real-time webcam stream via `getUserMedia`.
*  **Pixelation:** Dynamic downscaling and upscaling for that chunky retro look.
*  **Retro Palettes:** Multiple presets (Gameboy, NES, Vaporwave, etc.).
*  **Interactive Switcher:** Change looks on the fly with a simple UI.
*  **High Performance:** Smooth rendering using `requestAnimationFrame`.
*  **Color Mapping:** Euclidean distance algorithm for accurate palette matching.
*  **Zero Dependencies:** Pure Vanilla JS, no external libraries required.

---

## How It Works



1.  **Capture:** The webcam stream is accessed via the **MediaDevices API**.
2.  **Downsample:** Each video frame is drawn onto a hidden canvas at a tiny resolution (e.g., 120×120).
3.  **Analyze:** The script iterates through every pixel in the low-res frame.
4.  **Quantize:** The closest color from the active palette is calculated using the **Euclidean distance** formula.
5.  **Upscale:** The processed frame is scaled back up to fill the screen using `image-rendering: pixelated` to maintain sharp edges.

---

## 📁 Project Structure

```text
Pixel-Video/
│
├── index.html      # Main UI and Canvas layout
├── style.css       # Retro-themed styling
├── script.js       # Core logic (Processing & Palettes)
└── README.md       # Project documentation
```

## Run the project
Simply open index.html in a modern web browser (Chrome or Brave recommended for best performance).

[!IMPORTANT]
You must grant webcam permissions when prompted by the browser for the filter to work.

## Core Algorithm
To find the most accurate color match, the app calculates the distance between the source pixel $(r, g, b)$ and the palette color $(pr, pg, pb)$ using the 3D distance formula:
```
function get_color(r, g, b, palette) {
    let minDis = Infinity;
    let best = palette[0];
    for ([pr, pg, pb] of palette) {
        let dis = (r - pr) ** 2 + (g - pg) ** 2 + (b - pb) ** 2;
        if (dis < minDis) {
            minDis = dis;
            best = [pr, pg, pb];
        }
    }
    return best;
}
```
The pixel color is replaced with the palette color that yields the lowest distance value.

## Learning Value
This project is a great exercise for understanding:
+ Real-time image manipulation.
+ The math behind color quantization.
+ Managing high-frequency UI updates in the DOM.
