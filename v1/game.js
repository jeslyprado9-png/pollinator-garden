'use strict';

const flowers = {
  coneflower: { name: 'Coneflower', icon: '✿', color: 'purple' },
  susan: { name: 'Black-eyed Susan', icon: '✿', color: 'yellow' },
  balm: { name: 'Bee balm', icon: '✺', color: 'pink' }
};
const garden = document.querySelector('#garden');
const status = document.querySelector('#status');
const counter = document.querySelector('#counter');
const visitor = document.querySelector('#visitor');
let selected = 'coneflower';
let planted = 0;

for (let i = 0; i < 9; i += 1) {
  const plot = document.createElement('button');
  plot.type = 'button';
  plot.className = 'plot';
  plot.dataset.index = i;
  plot.setAttribute('aria-label', `Empty plot ${i + 1}. Plant ${flowers[selected].name}`);
  plot.innerHTML = '<span class="empty-mark" aria-hidden="true">+</span><span class="plot-label">Plant here</span>';
  garden.append(plot);
}

const plots = [...garden.querySelectorAll('.plot')];
function updateEmptyLabels() {
  plots.filter(plot => !plot.dataset.planted).forEach(plot => {
    plot.setAttribute('aria-label', `Empty plot ${Number(plot.dataset.index) + 1}. Plant ${flowers[selected].name}`);
  });
}

document.querySelectorAll('.flower-choice').forEach(button => {
  button.addEventListener('click', () => {
    selected = button.dataset.flower;
    document.querySelectorAll('.flower-choice').forEach(choice => {
      choice.setAttribute('aria-pressed', String(choice === button));
    });
    document.querySelector('#selection').textContent = `Ready to plant: ${flowers[selected].name}`;
    updateEmptyLabels();
    status.textContent = planted === 9 ? 'Your garden is full! Reset to plant a new garden.' : `${flowers[selected].name} selected. Choose an empty plot.`;
  });
});

plots.forEach(plot => {
  plot.addEventListener('click', () => {
    if (plot.dataset.planted) {
      status.textContent = 'This plot already has a flower. Choose an empty plot, or reset to start again.';
      return;
    }
    const flower = flowers[selected];
    plot.dataset.planted = selected;
    plot.classList.add('planted');
    plot.setAttribute('aria-label', `Plot ${Number(plot.dataset.index) + 1}: ${flower.name}, planted`);
    plot.setAttribute('aria-disabled', 'true');
    plot.innerHTML = `<span class="bloom ${flower.color}" aria-hidden="true">${flower.icon}</span><span class="plot-label">${flower.name}</span>`;
    planted += 1;
    counter.textContent = `${planted} / 9 planted`;
    status.textContent = planted === 9 ? 'Garden complete! A bee stopped by to visit your flowers.' : `${flower.name} planted! ${9 - planted} empty ${9 - planted === 1 ? 'plot' : 'plots'} left.`;
    visitor.hidden = planted !== 9;
  });
});

document.querySelector('#reset').addEventListener('click', () => {
  planted = 0;
  plots.forEach(plot => {
    delete plot.dataset.planted;
    plot.classList.remove('planted');
    plot.removeAttribute('aria-disabled');
    plot.innerHTML = '<span class="empty-mark" aria-hidden="true">+</span><span class="plot-label">Plant here</span>';
  });
  updateEmptyLabels();
  counter.textContent = '0 / 9 planted';
  visitor.hidden = true;
  status.textContent = `Garden reset. Choose an empty plot to plant ${flowers[selected].name}.`;
});
