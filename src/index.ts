interface IImages {
    desktop: IImage[];
    mobile: IImage[];
}
interface IImage {
    file: string;
    name: string;
    author: string;
}

interface IRaw {
    desktop: {
        [x: string]: string;
    };
    mobile: {
        [x: string]: string;
    };
}

async function getImages(): Promise<IImages> {
    return new Promise<IImages>((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.addEventListener("load", (ev) => {
            let raw: IRaw = JSON.parse(request.responseText);

            let desktopimages = Object.keys(raw.desktop);
            let desktopauthors = Object.values(raw.desktop);

            let mobileimages = Object.keys(raw.mobile);
            let mobileauthors = Object.values(raw.mobile);

            resolve({
                desktop: desktopimages.map((x, i) => {
                    return {
                        file: `images/desktop/${desktopimages[i]}.png`,
                        name: desktopimages[i],
                        author: desktopauthors[i]
                    };
                }),
                mobile: mobileimages.map((x, i) => {
                    return {
                        file: `images/mobile/${mobileimages[i]}.png`,
                        name: mobileimages[i],
                        author: mobileauthors[i]
                    };
                })
            });
        });
        request.open("GET", "images/images.json");
        request.send();
    });
}

let images: IImages;

window.addEventListener("load", async() => {
    images = await getImages();

    loadimage();
});

function loadimage() {
    let image = window.innerWidth < 500
            ? images.mobile[getRandomInt(0, images.mobile.length - 1)]
            : images.desktop[getRandomInt(0, images.desktop.length - 1)];

    let credit = document.querySelector<HTMLDivElement>(".credits .credit");
    if (credit) {
        credit.innerText = image.author || "Unknown";
    }
    let bg = document.querySelector<HTMLDivElement>(".bg");
    if (bg) {
        bg.style.backgroundImage = `url(${image.file})`;
    }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}