// now making the real chage to image
// const img=document.querySelector('.normal')
const video = document.querySelector('.webcam');
const canvas = document.querySelector('.pix_vid');
const ctx = canvas.getContext('2d');
const btn = document.querySelector('.srt');

// Making the image resolution retro
const RW = 120;
const RH = 120;

// factor for quantization
let factor = 4;

const smallcanvas = document.querySelector('#canvas');
smallcanvas.width = RW;
smallcanvas.height = RH;
const sctx = smallcanvas.getContext('2d');


let palette = [
    [230, 255, 220], // Bright highlight
    [170, 220, 170], // Light green
    [100, 170, 120], // Mid green
    [40, 90, 60]     // Deep green shadow
];

// setting up the plette list
let dict = new Object();

dict = {
    'Gameboy': [[15, 56, 15], [48, 98, 48], [139, 172, 15], [155, 188, 15]],
    'NES': [[0, 0, 0], [88, 88, 248], [248, 88, 88], [248, 248, 248]],
    'Atari': [[64, 64, 64], [148, 85, 0], [188, 188, 188], [252, 252, 84]],
    'Cool': [[16, 8, 26], [120, 167, 245], [252, 209, 155], [255, 255, 255]],
    'GB_Gray': [[26, 26, 26], [90, 90, 90], [160, 160, 160], [224, 224, 224]],
    'Vaporwave': [[45, 0, 75], [120, 60, 180], [255, 120, 200], [255, 240, 255]],
    'VirtualBoy': [[0, 0, 0], [90, 0, 0], [180, 0, 0], [255, 0, 0]],
    'Spectrum': [[0, 0, 0], [0, 0, 215], [215, 0, 0], [215, 215, 215]],
    'Noir': [[0, 0, 0], [85, 85, 85], [170, 170, 170], [255, 255, 255]],
    'Cyberpunk': [[5, 5, 15], [0, 180, 180], [255, 0, 120], [240, 240, 255]],
    'Antiquity_16': [
        [32, 32, 32], [45, 33, 30], [69, 41, 35], [109, 61, 41],
        [177, 107, 74], [232, 159, 110], [232, 190, 130], [93, 117, 87],
        [142, 146, 87], [112, 123, 136], [138, 167, 172], [229, 93, 77],
        [241, 134, 108], [210, 103, 48], [222, 154, 40], [232, 216, 165]
    ],
    'CC_29': [
        [242, 240, 229], [184, 181, 185], [134, 129, 136], [100, 99, 101],
        [69, 68, 79], [58, 56, 88], [33, 33, 35], [53, 43, 66], [67, 67, 106],
        [75, 128, 202], [104, 194, 211], [162, 220, 199], [237, 225, 158],
        [211, 160, 104], [180, 82, 82], [106, 83, 110], [75, 65, 88],
        [128, 73, 58], [167, 123, 91], [229, 206, 180], [194, 211, 104],
        [138, 176, 96], [86, 123, 121], [78, 88, 74], [123, 114, 67],
        [178, 180, 126], [237, 200, 196], [207, 138, 203], [95, 85, 106]
    ],
    'Cool_Sweater': [
        [16, 8, 26], [120, 167, 245], [252, 209, 155], [255, 255, 255]
    ],
    'Nostalgia': [
        [46, 37, 61], [176, 176, 176]
    ],
    'Retro_Vibes': [
        [86, 71, 86], [80, 125, 186], [90, 204, 160], [229, 247, 210]
    ],
    'Seoul_City': [
        [38, 84, 124], [239, 71, 111], [247, 140, 107], [255, 209, 102],
        [6, 214, 160], [255, 252, 249]
    ],
    'White_Scape': [
        [0, 0, 0], [31, 35, 46], [95, 115, 123], [162, 179, 178],
        [67, 24, 55], [165, 53, 81], [225, 143, 137], [225, 192, 169],
        [232, 227, 227]
    ]
};

async function open_cam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        await video.play();
    }
    catch (err) {
        console.error(`Error accessing webcam: ${err.name}-${err.message} OR open your webcam and reload`);
        alert('Could not access the webcam');
    }
}

// function for making new palette
// here i have used euclidian distance
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

function stretch(r) {
    // 1. Normalize to 0.0 - 1.0
    let x = r / 255;

    // 2. Linear Contrast Stretch (using 0.5 as midpoint)
    const strength = 1.5;
    x = 0.5 + (x - 0.5) * strength;

    // 3. Sigmoid S-Curve (The "Smoothing" part)
    // We must clamp x to 0-1 first so the math doesn't explode
    x = Math.max(0, Math.min(1, x));

    if (x < 0.5) {
        x = 2 * x * x;
    } else {
        x = 1 - 2 * (1 - x) * (1 - x);
    }

    // 4. Denormalize back to 0 - 255
    Math.max(0, Math.min(1, x))
    return x * 255;
}

// now making the image pixel art
function pixelate() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (canvas.width != video.videoWidth) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        }

        // now for making the image smaller
        let w = canvas.width;
        let h = canvas.height;
        console.log(w, h);

        ctx.imageSmoothingEnabled = false;

        //1) drwing to smaller frame
        sctx.drawImage(video, 0, 0, RW, RH);

        // 2)Now i will take pixels of small canvas
        const smallimg = sctx.getImageData(0, 0, RW, RH)
        const d = smallimg.data;

        //3) now chaninging palette
        for (let i = 0; i < d.length; i = i + 4) {

            let r_in = d[i];
            let g_in = d[i + 1];
            let b_in = d[i + 2];
            // r_in=stretch(r_in);
            // g_in=stretch(g_in);
            // b_in=stretch(b_in);

            let [r, g, b] = get_color(r_in, g_in, b_in, palette);
            d[i] = r;
            d[i + 1] = g;
            d[i + 2] = b;


            // USE ONLY WHEN FACTOR IS LARGER
            // // factor for flat shading (quantization)
            // d[i]     = Math.floor(r / factor) * factor;
            // d[i+1]   = Math.floor(g / factor) * factor;
            // d[i+2]   = Math.floor(b / factor) * factor;

        }

        // now putting the image data
        sctx.putImageData(smallimg, 0, 0)
        // to unable smoothing
        ctx.imageSmoothingEnabled = false;
        // now drawing back to bigger frame
        ctx.drawImage(smallcanvas, 0, 0, RW, RH, 0, 0, w, h);
    }
    requestAnimationFrame(pixelate);
}

// Function to open the palette
// 1. Remove the '#' symbols
const scroll_section = document.getElementById('scroll-list');
const open_btn = document.getElementById('pale');

// 2. Add an event listener to the button
open_btn.addEventListener('click', () => {
    // Check computed style because .style.display starts empty
    const isHidden = window.getComputedStyle(scroll_section).display === 'none';

    if (isHidden) {
        scroll_section.style.display = 'block';
        open_btn.textContent = "Close Palette";
    } else {
        scroll_section.style.display = 'none';
        open_btn.textContent = "View Palette";
    }
});

// no function to set the theme and the border of the selected palette
document.querySelectorAll('.palette-card').forEach(card => {
    card.addEventListener('click', e => {
        const theme = e.currentTarget.querySelector('.palette-name').textContent;
        console.log('Setting up theme ' + theme);

        // setting the palette
        palette = dict[theme];

        document.querySelectorAll('.palette-card').forEach(card => {
            card.style.borderColor = '#222';
        })
        e.currentTarget.style.borderColor = '#0f0';
    });

});

// now to set the palette on click


video.addEventListener('play', pixelate);
