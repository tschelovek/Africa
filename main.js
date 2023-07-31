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
//* Ареолы вокруг маркеров
    const countriesBordersArr = canvas.querySelectorAll('path[data-country-id]')
//* state.flags - буфер для хранения уже сгенерированных флагов
    const state = {
        flags: {},
    };

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
    countriesBordersArr.forEach(
        markerBorder => markerBorder.addEventListener(
            'mouseover',
            e => countryMouseoverHandler(e)
        )
    );
    countriesBordersArr.forEach(
        markerBorder => markerBorder.addEventListener(
            'mouseout',
            e => countryMouseoutHandler(e)
        )
    );

    function markerMouseoverHandler(event) {
        const name = event.currentTarget.dataset.markerId;
        const targetCountry = canvas.querySelector(`path[data-country-id=${name}]`);

        if (event.relatedTarget === targetCountry) {
            return
        }
        if (event.relatedTarget === canvas.querySelector(`circle[data-marker-border-id=${name}]`)) {
            return
        }

        targetCountry.classList.add('highlighted');
        showFlag({
            id: name,
            targetMarker: event.currentTarget,
            targetCountry
        })
    }

    function markerMouseoutHandler(event) {
        const name = event.currentTarget.dataset.markerId;
        const targetCountry = canvas.querySelector(`path[data-country-id=${name}]`);

        if (event.relatedTarget === targetCountry) {
            return
        }
        if (event.relatedTarget === canvas.querySelector(`circle[data-marker-border-id=${name}]`)) {
            return
        }

        targetCountry.classList.remove('highlighted');
        removeFlag(name);
    }

    function markerBorderMouseoverHandler(event) {
        const name = event.currentTarget.dataset.markerBorderId;
        const targetCountry = canvas.querySelector(`path[data-country-id=${name}]`);

        if (event.relatedTarget === targetCountry) {
            return
        }
        if (event.relatedTarget === canvas.querySelector(`circle[data-marker-id=${name}]`)) {
            return
        }

        targetCountry.classList.add('highlighted');
        showFlag({
            id: name,
            targetCountry
        })
    }

    function markerBorderMouseoutHandler(event) {
        const name = event.currentTarget.dataset.markerBorderId;
        const targetCountry = canvas.querySelector(`path[data-country-id=${name}]`);

        if (event.relatedTarget === targetCountry) {
            return;
        }
        if (event.relatedTarget === canvas.querySelector(`circle[data-marker-id=${name}]`)) {
            return
        }

        targetCountry.classList.remove('highlighted');
        removeFlag(name);
    }

    function countryMouseoverHandler(event) {
        const id = event.currentTarget.dataset.countryId;

        if (event.relatedTarget === canvas.querySelector(`circle[data-marker-border-id=${id}]`)) {
            return
        }
        if (event.relatedTarget === canvas.querySelector(`circle[data-marker-id=${id}]`)) {
            return
        }

        event.currentTarget.classList.add('highlighted');
        showFlag({
            id: event.currentTarget.dataset.countryId,
            targetCountry: event.currentTarget
        });
    }

    function countryMouseoutHandler(event) {
        const id = event.currentTarget.dataset.countryId;

        if (event.relatedTarget === canvas.querySelector(`circle[data-marker-border-id=${id}]`)) {
            return
        }
        if (event.relatedTarget === canvas.querySelector(`circle[data-marker-id=${id}]`)) {
            return
        }

        event.currentTarget.classList.remove('highlighted');
        removeFlag(id);
    }

    function showFlag({id, targetMarker, targetCountry}) {
        !targetMarker
            ? targetMarker = canvas.querySelector(`circle[data-marker-id=${id}]`)
            : null;
        !targetCountry
            ? targetCountry = canvas.querySelector(`path[data-country-id=${id}]`)
            : null;
        !state.flags[id]
            ? state.flags[id] = createFlag(id, targetCountry.dataset.flagSrc)
            : null;

        const flag = state.flags[id];
        const {top, left, width, height} = targetMarker.getBoundingClientRect();
        const {width: canvasWidth} = canvas.getBoundingClientRect();
        let flagOffsetX;
        canvasWidth < FULL_CANVAS_WIDTH
            ? flagOffsetX = compensateShrunkenOffset(FLAG_OFFSET_X, canvasWidth)
            : flagOffsetX = FLAG_OFFSET_X;

        flag.style.left = `${(left - flagOffsetX - (width / 2)).toString()}px`;
        flag.style.top = `${(top - FLAG_OFFSET_Y - height).toString()}px`;

        document.body.append(flag);
        setTimeout(() => flag.classList.add('show'), 100)
    }

    function compensateShrunkenOffset(size, canvasWidth) {
        return FULL_CANVAS_WIDTH / canvasWidth * size
    }

    function removeFlag(id) {
        state.flags[id]?.classList.remove('show')
        setTimeout(() => state.flags[id]?.remove(), 300)
    }

    /**
     *
     * @param src - строка с адресом картинки
     * @param name - строка с названием страны
     * @returns {HTMLDivElement} - возвращаем флаг-компонент
     */
    function createFlag(name = '', src = '' ) {
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
})
