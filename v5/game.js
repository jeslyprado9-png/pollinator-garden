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

const saveKey = 'pollinator-garden:v5';
let slots = Array(9).fill(null);
const saveStatus = document.querySelector('#save-status');

function updatePlotLabels() {
  plots.forEach((plot, index) => {
    plot.setAttribute('aria-label', slots[index]
      ? `Plot ${index + 1}: ${flowers[slots[index]].name}. Replace with ${flowers[selected].name}`
      : `Empty plot ${index + 1}. Plant ${flowers[selected].name}`);
  });
}

function saveGarden() {
  try {
    localStorage.setItem(saveKey, JSON.stringify({ version: 5, slots, selected }));
    saveStatus.textContent = 'Saved in this browser.';
  } catch {
    saveStatus.textContent = 'Saving unavailable. You can keep playing, but changes may be lost on reload.';
  }
}

function restoreGarden() {
  try {
    const raw = localStorage.getItem(saveKey);
    if (raw === null) return;
    const saved = JSON.parse(raw);
    if (!saved || saved.version !== 5 || !Array.isArray(saved.slots) || saved.slots.length !== 9 ||
        !saved.slots.every(value => value === null || (typeof value === 'string' && Object.hasOwn(flowers, value))) ||
        typeof saved.selected !== 'string' || !Object.hasOwn(flowers, saved.selected)) throw new Error('Invalid save');
    slots = saved.slots;
    selected = saved.selected;
    saveStatus.textContent = 'Garden restored from this browser.';
    status.textContent = 'Saved garden restored. Choose a flower, then an empty or planted plot.';
  } catch {
    saveStatus.textContent = 'Saved garden could not be loaded. Starting empty; planting will try a new save.';
  }
}

function renderGarden() {
  counts = { coneflower: 0, susan: 0, balm: 0 };
  planted = 0;
  slots.forEach((id, index) => {
    const plot = plots[index];
    plot.classList.toggle('planted', id !== null);
    if (id === null) {
      delete plot.dataset.planted;
      plot.innerHTML = emptyPlot;
    } else {
      const flower = flowers[id];
      counts[id] += 1;
      planted += 1;
      plot.dataset.planted = id;
      plot.innerHTML = `<span class="bloom ${flower.color}" aria-hidden="true">${flower.icon}</span><span class="plot-label">${flower.name}</span>`;
    }
  });
  document.querySelectorAll('.flower-choice').forEach(choice => {
    choice.setAttribute('aria-pressed', String(choice.dataset.flower === selected));
  });
  document.querySelector('#selection').textContent = `Ready to plant or replace: ${flowers[selected].name}`;
  updatePlotLabels();
  counter.textContent = `${planted} / 9 planted`;
  const updates = [...updateVisitors(), ...updateChallenges()];
  updateSummary();
  return updates;
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
    if (!arrived && visitors[visitor]) arrivals.push(`${name} goal no longer met.`);
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
    if (done && !completed[id]) {
      announcements.push(`${names[id]} challenge complete!`);
      flash(document.querySelector(`#${id}-card`));
    }
    if (!done && completed[id]) announcements.push(`${names[id]} challenge is back in progress.`);
    completed[id] = done;
  }
  const total = Object.values(completed).filter(Boolean).length;
  document.querySelector('#challenge-count').textContent = `${total} / 3 complete`;
  return announcements;
}

function flash(element) {
  element.classList.remove('celebrate');
  // Restart brief feedback even when the same plot changes twice.
  void element.offsetWidth;
  element.classList.add('celebrate');
}
document.addEventListener('animationend', event => event.target.classList.remove('celebrate'));

function updateSummary() {
  document.querySelector('#summary-total').textContent = `${Object.values(completed).filter(Boolean).length} / 3 challenges complete`;
  document.querySelector('#summary-types').textContent = `${Object.values(counts).filter(n => n > 0).length} / 3 types`;
  document.querySelector('#summary-visitors').textContent = `${Number(visitors.bee) + Number(visitors.butterfly)} / 2 arrived`;
  document.querySelector('#summary-plots').textContent = `${planted} / 9 plots`;
  document.querySelector('#summary-bee').textContent = `${Math.min(counts.coneflower + counts.susan, 3)} / 3${visitors.bee ? ' · Arrived!' : ''}`;
  document.querySelector('#summary-butterfly').textContent = `${Math.min(counts.balm, 2)} / 2 balm, ${Math.min(counts.coneflower, 1)} / 1 cone${visitors.butterfly ? ' · Arrived!' : ''}`;
  for (const id of Object.keys(completed)) {
    const item = document.querySelector(`#summary-${id}`);
    if (completed[id] && !item.classList.contains('done')) flash(item);
    item.classList.toggle('done', completed[id]);
  }
}

function gardenMessage() {
  if (Object.values(completed).every(Boolean)) return 'All three challenges complete! Both visitors are here. Keep experimenting or reset to play again.';
  if (planted === 9) return 'Garden full. Some goals are still unmet. Replace a flower to try a different mix.';
  if (visitors.bee && visitors.butterfly) {
    return 'Both visitors are here! Keep planting or replace flowers to try another mix.';
  }
  return `${9 - planted} empty ${9 - planted === 1 ? 'plot' : 'plots'} left. Check the visitor goals.`;
}

document.querySelectorAll('.flower-choice').forEach(button => {
  button.addEventListener('click', () => {
    selected = button.dataset.flower;
    renderGarden();
    saveGarden();
    status.textContent = `${flowers[selected].name} selected. Select an empty plot to plant or a planted plot to replace. ${gardenMessage()}`;
  });
});

plots.forEach((plot, index) => {
  plot.addEventListener('click', () => {
    const previous = slots[index];
    if (previous === selected) {
      status.textContent = `This plot already has ${flowers[selected].name}. Choose a different flower to replace it.`;
      return;
    }
    slots[index] = selected;
    const updates = renderGarden();
    plots.forEach(other => { delete other.dataset.feedback; other.classList.remove('celebrate'); });
    plot.dataset.feedback = previous ? 'Replaced' : 'Planted';
    flash(plot);
    saveGarden();
    const action = previous ? `${flowers[previous].name} replaced with ${flowers[selected].name}.` : `${flowers[selected].name} planted!`;
    status.textContent = [action, ...updates, gardenMessage()].join(' ');
  });
});

function clearGarden() {
  slots = Array(9).fill(null);
  plots.forEach(plot => { delete plot.dataset.feedback; plot.classList.remove('celebrate'); });
  renderGarden();
  try {
    localStorage.removeItem(saveKey);
    saveStatus.textContent = 'Saved garden cleared in this browser.';
  } catch {
    // Some browsers can reject removal while still allowing writes.
    try {
      localStorage.setItem(saveKey, JSON.stringify({ version: 5, slots, selected }));
      saveStatus.textContent = 'Empty garden saved in this browser.';
    } catch {
      saveStatus.textContent = 'Could not clear browser storage. Old plants may return on reload. Clear this site’s browser data to remove them.';
    }
  }
  status.textContent = 'Garden reset. Visitor and challenge progress cleared.';
}
const resetDialog = document.querySelector('#reset-dialog');
document.querySelector('#reset').addEventListener('click', () => {
  if (planted === 0) { clearGarden(); return; }
  resetDialog.returnValue = 'cancel';
  resetDialog.showModal();
});
resetDialog.addEventListener('close', () => {
  if (resetDialog.returnValue === 'clear') clearGarden();
  document.querySelector('#reset').focus();
});
// Keep Tab on the two choices; native dialog handles Escape and the backdrop.
resetDialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const buttons = [...resetDialog.querySelectorAll('button')];
  const first = buttons[0];
  const last = buttons[buttons.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});
garden.addEventListener('keydown', event => {
  const index = plots.indexOf(event.target);
  if (index < 0) return;
  const offsets = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 3, ArrowUp: -3 };
  if (!Object.hasOwn(offsets, event.key)) return;
  event.preventDefault();
  plots[(index + offsets[event.key] + 9) % 9].focus();
});
restoreGarden();
renderGarden();
