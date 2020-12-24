'use strict';
let multiItemSlider = (function () {
    return function (selector, config) {
        let mainElement = document.querySelector(selector),
            sliderWrapper = mainElement.querySelector('.slider__wrapper'),
            sliderItems = mainElement.querySelectorAll('.slider__item'),
            sliderControls = mainElement.querySelectorAll('.slider__control'),
            wrapperWidth = parseFloat(getComputedStyle(sliderWrapper).width),
            itemWidth = parseFloat(getComputedStyle(sliderItems[0]).width),
            positionLeftItem = 0,
            transform = 0,
            step = itemWidth / wrapperWidth * 100,
            items = [],
            interval = 0,
            configuration = {
                isCycling: true, // Автоматическая смена слайдов
                direction: 'right',
                interval: 5000,
                pause: false
            };

        for (let key in config) {
            if (key in configuration) {
                configuration[key] = config[key];
            }
        }

        sliderItems.forEach(function (item, index) {
            items.push({ item: item, position: index, transform: 0 });
        });

        let position = {
            getItemMin: function () {
                let indexItem = 0;
                items.forEach(function (item, index) {
                    if (item.position < items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getItemMax: function () {
                let indexItem = 0;
                items.forEach(function (item, index) {
                    if (item.position > items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getMin: function () {
                return items[position.getItemMin()].position;
            },
            getMax: function () {
                return items[position.getItemMax()].position;
            }
        }

        let transformItem = function (direction) {
            let nextItem;
            if (direction === 'right') {
                positionLeftItem++;
                if ((positionLeftItem + wrapperWidth / itemWidth - 1) > position.getMax()) {
                    nextItem = position.getItemMin();
                    items[nextItem].position = position.getMax() + 1;
                    items[nextItem].transform += items.length * 100;
                    items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
                }
                transform -= step;
            }
            if (direction === 'left') {
                positionLeftItem--;
                if (positionLeftItem < position.getMin()) {
                    nextItem = position.getItemMax();
                    items[nextItem].position = position.getMin() - 1;
                    items[nextItem].transform -= items.length * 100;
                    items[nextItem].item.style.transform = 'translateX(' + items[nextItem].transform + '%)';
                }
                transform += step;
            }
            sliderWrapper.style.transform = 'translateX(' + transform + '%)';
        }

        let cycle = function (direction) {
            if (!configuration.isCycling) {
                return;
            }
            interval = setInterval(function () {
                transformItem(direction);
            }, configuration.interval);
        }

        let controlClick = function (e) {
            if (e.target.classList.contains('slider__control')) {
                e.preventDefault();
                let direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
                transformItem(direction);
                clearInterval(interval);
                cycle(configuration.direction);
            }
        };

        let setUpListeners = function () {
            // добавление к кнопкам "назад" и "вперед" обработчика controlClick для события click
            sliderControls.forEach(function (item) {
                item.addEventListener('click', controlClick);
            });
            if (configuration.pause && configuration.isCycling) {
                mainElement.addEventListener('mouseenter', function () {
                    clearInterval(interval);
                });
                mainElement.addEventListener('mouseleave', function () {
                    clearInterval(interval);
                    cycle(configuration.direction);
                });
            }
        }

        setUpListeners();
        cycle(configuration.direction);

        return {
            right: function () { // метод right
                transformItem('right');
            },
            left: function () { // метод left
                transformItem('left');
            }
        }

    }
}());

let slider = multiItemSlider('.slider', {
    isCycling: true
})