'use strict';

const flowers = {
  coneflower: { name: 'Coneflower', icon: '✿', color: 'purple' },
  susan: { name: 'Black-eyed Susan', icon: '✿', color: 'yellow' },
  balm: { name: 'Bee balm', icon: '✺', color: 'pink' }
};
const garden = document.querySelector('#garden');
const status = document.querySelector('#status');
const counter = document.querySelector('#counter');
let selected = 'coneflower';
let planted = 0;
let counts = { coneflower: 0, susan: 0, balm: 0 };
let visitors = { bee: false, butterfly: false };
let completed = { mix: false, welcome: false, nine: false };
const emptyPlot = '<span class="empty-mark" aria-hidden="true">+</span><span class="plot-label">Plant here</span>';

for (let i = 0; i < 9; i += 1) {
  const plot = document.createElement('button');
  plot.type = 'button';
  plot.className = 'plot';
  plot.dataset.index = i;
  plot.innerHTML = emptyPlot;
  garden.append(plot);
}
const plots = [...garden.querySelectorAll('.plot')];

function updateEmptyLabels() {
  plots.filter(plot => !plot.dataset.planted).forEach(plot => {
    plot.setAttribute('aria-label', `Empty plot ${Number(plot.dataset.index) + 1}. Plant ${flowers[selected].name}`);
  });
}

function setProgress(id, count, goal) {
  const value = Math.min(count, goal);
  document.querySelector(`#${id}-count`).textContent = `${value} / ${goal}`;
  const progress = document.querySelector(`#${id}-progress`);
  progress.value = value;
  progress.textContent = `${value} of ${goal}`;
}

function updateVisitors() {
  setProgress('bee', counts.coneflower + counts.susan, 3);
  setProgress('balm', counts.balm, 2);
  setProgress('cone', counts.coneflower, 1);
  const next = {
    bee: counts.coneflower + counts.susan >= 3,
    butterfly: counts.balm >= 2 && counts.coneflower >= 1
  };
  const arrivals = [];
  for (const [visitor, arrived] of Object.entries(next)) {
    const name = visitor === 'bee' ? 'Bee' : 'Butterfly';
    document.querySelector(`#${visitor}-card`).classList.toggle('arrived', arrived);
    document.querySelector(`#${visitor}-arrival`).textContent = arrived ? `${name} arrived!` : 'Not here yet';
    if (arrived && !visitors[visitor]) arrivals.push(`${name} arrived!`);
  }
  visitors = next;
  document.querySelector('#visitor-count').textContent = `${Number(next.bee) + Number(next.butterfly)} / 2 arrived`;
  return arrivals;
}

function updateChallenges() {
  const values = {
    mix: Object.values(counts).filter(count => count > 0).length,
    welcome: Number(visitors.bee) + Number(visitors.butterfly),
    nine: planted
  };
  const goals = { mix: 3, welcome: 2, nine: 9 };
  const names = { mix: 'Flower sampler', welcome: 'Welcome both visitors', nine: 'Nine blooms' };
  const announcements = [];
  for (const id of Object.keys(values)) {
    setProgress(id, values[id], goals[id]);
    const done = values[id] >= goals[id];
    document.querySelector(`#${id}-card`).classList.toggle('complete', done);
    document.querySelector(`#${id}-state`).textContent = done ? 'Complete!' : 'In progress';
    if (done && !completed[id]) announcements.push(`${names[id]} challenge complete!`);
    completed[id] = done;
  }
  const total = Object.values(completed).filter(Boolean).length;
  document.querySelector('#challenge-count').textContent = `${total} / 3 complete`;
  return announcements;
}

function gardenMessage() {
  if (Object.values(completed).every(Boolean)) return 'All three challenges complete! Both visitors are here. Reset to play again.';
  if (planted === 9) return 'Garden full. Some goals are still unmet. Reset to try a different flower mix.';
  if (visitors.bee && visitors.butterfly) {
    return 'Both visitors are here! Keep planting or reset to try another mix.';
  }
  return `${9 - planted} empty ${9 - planted === 1 ? 'plot' : 'plots'} left. Check the visitor goals.`;
}

document.querySelectorAll('.flower-choice').forEach(button => {
  button.addEventListener('click', () => {
    selected = button.dataset.flower;
    document.querySelectorAll('.flower-choice').forEach(choice => {
      choice.setAttribute('aria-pressed', String(choice === button));
    });
    document.querySelector('#selection').textContent = `Ready to plant: ${flowers[selected].name}`;
    updateEmptyLabels();
    status.textContent = `${flowers[selected].name} selected. ${gardenMessage()}`;
  });
});

plots.forEach(plot => {
  plot.addEventListener('click', () => {
    if (plot.dataset.planted) {
      status.textContent = `This plot already has a flower. ${gardenMessage()}`;
      return;
    }
    const flower = flowers[selected];
    plot.dataset.planted = selected;
    plot.classList.add('planted');
    plot.setAttribute('aria-label', `Plot ${Number(plot.dataset.index) + 1}: ${flower.name}, planted`);
    plot.setAttribute('aria-disabled', 'true');
    plot.innerHTML = `<span class="bloom ${flower.color}" aria-hidden="true">${flower.icon}</span><span class="plot-label">${flower.name}</span>`;
    planted += 1;
    counts[selected] += 1;
    counter.textContent = `${planted} / 9 planted`;
    const arrivals = updateVisitors();
    const achievements = updateChallenges();
    status.textContent = [`${flower.name} planted!`, ...arrivals, ...achievements, gardenMessage()].join(' ');
  });
});

document.querySelector('#reset').addEventListener('click', () => {
  planted = 0;
  counts = { coneflower: 0, susan: 0, balm: 0 };
  plots.forEach(plot => {
    delete plot.dataset.planted;
    plot.classList.remove('planted');
    plot.removeAttribute('aria-disabled');
    plot.innerHTML = emptyPlot;
  });
  updateEmptyLabels();
  updateVisitors();
  updateChallenges();
  counter.textContent = '0 / 9 planted';
  status.textContent = `Garden reset. Visitor and challenge progress cleared. Choose an empty plot to plant ${flowers[selected].name}.`;
});
updateEmptyLabels();
