document.addEventListener('DOMContentLoaded', () => {
//* Отступы для изменения вёрстки (размера, положения) флага относительно маркера, в px
    const FLAG_OFFSET_X = 9;
    const FLAG_OFFSET_Y = 58;
//* Полная ширина изображения карты для расчёта смещения флага при масштабировании
    const FULL_CANVAS_WIDTH = 583;
//* Наша svg-карта
    const canvas = document.getElementById('canvas');
//* Маркеры
    const markersArr = canvas.querySelectorAll('circle[data-marker-id]')
//* Буфер для хранения уже сгенерированных флагов
    const state = {
        flags: {},
    };

    /**
     *
     * @param src - строка с адресом картинки
     * @param name - строка с названием страны
     * @returns {HTMLDivElement} - возвращаем флаг-компонент
     */
    function createFlag(src = '', name = '') {
        const flagPole = document.createElement('div');
        const img = document.createElement('img');
        const imgWrapper = document.createElement('div');

        img.src = src;
        img.alt = name;
        imgWrapper.classList.add('flag__img-wrapper');
        flagPole.classList.add('flag');

        imgWrapper.append(img);
        flagPole.append(imgWrapper);

        return flagPole;
    }

    markersArr.forEach(marker => marker.addEventListener('mouseover', (e) => markerMouseoverHandler(e)));
    markersArr.forEach(marker => marker.addEventListener('mouseout', (e) => markerMouseoutHandler(e)));

    function markerMouseoverHandler(event) {
        const target = event.currentTarget;
        const name = target.dataset.markerId;
        const targetCountry = canvas.querySelector(`path[data-coutry-id=${name}]`);

        if (!state.flags[name]) {
            state.flags[name] = createFlag(targetCountry.dataset.flagSrc, name)
        }
        const flag = state.flags[name];

        const {top, left, width, height} = target.getBoundingClientRect();
        const {width: canvasWidth} = canvas.getBoundingClientRect();
        let flagOffsetX;
        canvasWidth < FULL_CANVAS_WIDTH
            ? flagOffsetX = compensateShrunkenOffset(FLAG_OFFSET_X, canvasWidth)
            : flagOffsetX = FLAG_OFFSET_X;

        flag.style.left = `${(left - flagOffsetX - (width / 2)).toString()}px`;
        flag.style.top = `${(top - FLAG_OFFSET_Y - height).toString()}px`;

        targetCountry.classList.add('highlighted');
        document.body.append(flag);
        setTimeout(() => flag.classList.add('show'), 100);
    }

    function markerMouseoutHandler(event) {
        const name = event.currentTarget.dataset.markerId;
        const targetCountry = canvas.querySelector(`path[data-coutry-id=${name}]`);
        const flag = state.flags[name];

        flag.classList.remove('show');
        setTimeout(() => targetCountry.classList.remove('highlighted'), 100)
        setTimeout(() => flag.remove(), 400);
    }

    function compensateShrunkenOffset(size, canvasWidth) {
        return  FULL_CANVAS_WIDTH / canvasWidth * size
    }
})
