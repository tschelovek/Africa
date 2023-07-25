const canvas = document.getElementById('canvas');
const state = {
    flags: {
        russia: {},
    },
};

function createFlagPole(src) {
    const flagPole = document.createElement('div');
    const img = document.createElement('img');
    const wrapper = document.createElement('foreignObject');

    img.src = src;
    flagPole.classList.add('flag');
    wrapper.style.width = '43';
    wrapper.style.height = '43';

    flagPole.append(img);
    wrapper.append(flagPole);

    return wrapper;
}

canvas.querySelector('circle[data-marker-id]').addEventListener('mouseover', (e) => markerHandler(e))

let counter = 0;
function markerHandler(event) {
    const targetMarker = event.currentTarget;
    const name = targetMarker.dataset.markerId;
    const targetCountry = canvas.querySelector(`path[data-coutry-id=${name}]`);

    if(!state.flags[name]) {
        state.flags[name] = createFlagPole(targetCountry.dataset.flagSrc)
    }

    // wrapper.dataset.count = String(counter++);
    // wrapper.append(state.flags[name])

    // document.body.append(wrapper)
    targetMarker.append(state.flags[name])
    console.log(state)
}

const { top, left, width, height } = canvas.querySelector('circle[data-marker-id="zimbabwe"]').getBoundingClientRect();
// const { top, left, width, height } = canvas.querySelector('circle[data-marker-id]').getBoundingClientRect();

console.log(top, left, width, height)
console.log(canvas.querySelector('circle[data-marker-id="uar"]').getBoundingClientRect())


