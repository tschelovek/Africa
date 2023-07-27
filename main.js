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
//* Ареолы вокруг маркеров
    const markerBordersArr = canvas.querySelectorAll('circle[data-marker-border-id]')
//* state.flags - буфер для хранения уже сгенерированных флагов
    const state = {
        isOnMarker: false,
        isOnMarkerBorder: false,
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

    markersArr.forEach(
        marker => marker.addEventListener(
            'mouseover',
            e => markerMouseoverHandler(e)
        )
    );
    markersArr.forEach(
        marker => marker.addEventListener(
            'mouseout',
            e => markerMouseoutHandler(e)
        )
    );
    markerBordersArr.forEach(
        markerBorder => markerBorder.addEventListener(
            'mouseover',
            e => markerBorderMouseoverHandler(e)
        )
    );
    markerBordersArr.forEach(
        markerBorder => markerBorder.addEventListener(
            'mouseout',
            e => markerBorderMouseoutHandler(e)
        )
    );

    function markerMouseoverHandler(event) {
        state.isOnMarker = true;

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
    }

    function markerMouseoutHandler(event) {
        state.isOnMarker = false;

        const name = event.currentTarget.dataset.markerId;
        const targetCountry = canvas.querySelector(`path[data-coutry-id=${name}]`);
        const flag = state.flags[name];

        flag.classList.remove('show');
        setTimeout(() => {
                if (!state.isOnMarkerBorder) {
                    targetCountry.classList.remove('highlighted')
                }
            },
            200
        )
        setTimeout(() => flag.remove(), 200);
    }

    function markerBorderMouseoverHandler(event) {
        state.isOnMarkerBorder = true;

        const name = event.currentTarget.dataset.markerBorderId;

        if (event.relatedTarget === canvas.querySelector(`path[data-marker-id=${name}]`)) {
            return
        }

        const targetCountry = canvas.querySelector(`path[data-coutry-id=${name}]`);

        targetCountry.classList.add('highlighted');
    }

    function markerBorderMouseoutHandler(event) {
        state.isOnMarkerBorder = false;

        const name = event.currentTarget.dataset.markerBorderId;
        const targetCountry = canvas.querySelector(`path[data-coutry-id=${name}]`);

        setTimeout(() => {
                if (!state.isOnMarker) {
                    targetCountry.classList.remove('highlighted')
                }
            },
            200
        )
    }

    function compensateShrunkenOffset(size, canvasWidth) {
        return FULL_CANVAS_WIDTH / canvasWidth * size
    }
})
