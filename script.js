const topicSearch = document.querySelector('#topic-search');
const cards = [...document.querySelectorAll('.card')];
const newsletterForm = document.querySelector('#newsletter-form');
const formMessage = document.querySelector('#form-message');
const yearSpan = document.querySelector('#year');
const moleculeButtons = [...document.querySelectorAll('.molecule-btn')];
const moleculeName = document.querySelector('#molecule-name');
const moleculeUse = document.querySelector('#molecule-use');
const moleculeMech = document.querySelector('#molecule-mech');
const moleculeToxic = document.querySelector('#molecule-toxic');

const mnemonicFilters = [...document.querySelectorAll('.mnemonic-filter')];
const mnemonicCards = [...document.querySelectorAll('.mnemonic-card')];

const protocolType = document.querySelector('#protocol-type');
const sampleCount = document.querySelector('#sample-count');
const precisionLevel = document.querySelector('#precision-level');
const sampleCountValue = document.querySelector('#sample-count-value');
const precisionValue = document.querySelector('#precision-value');
const generateProtocolButton = document.querySelector('#generate-protocol');
const protocolSteps = document.querySelector('#protocol-steps');
const protocolSummary = document.querySelector('#protocol-summary');
const protocolResults = document.querySelector('#protocol-results');

const equipmentSearch = document.querySelector('#equipment-search');
const equipmentCards = [...document.querySelectorAll('.equipment-card')];

yearSpan.textContent = new Date().getFullYear();

topicSearch.addEventListener('input', () => {
  const query = topicSearch.value.toLowerCase().trim();

  cards.forEach((card) => {
    const content = `${card.textContent} ${card.dataset.keywords}`.toLowerCase();
    card.classList.toggle('hidden', query && !content.includes(query));
  });
});

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value.trim();

  formMessage.textContent = email
    ? `Thanks! ${email} has been added to the thepharmafile update list.`
    : 'Please enter a valid email address.';

  newsletterForm.reset();
});

const molecules = {
  aspirin: {
    name: 'Aspirin (Acetylsalicylic acid)',
    use: 'Analgesic, antipyretic, anti-inflammatory, and antiplatelet therapy.',
    mechanism: 'Irreversible cyclooxygenase inhibition, reducing prostaglandin and thromboxane synthesis.',
    toxic: 'Overdose may cause salicylate toxicity with tinnitus, mixed acid-base abnormalities, and hyperventilation.',
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O'
  },
  paracetamol: {
    name: 'Paracetamol (Acetaminophen)',
    use: 'First-line analgesic and antipyretic for mild to moderate pain and fever.',
    mechanism: 'Predominantly central COX pathway modulation with minimal peripheral anti-inflammatory effect.',
    toxic: 'High doses can cause severe hepatotoxicity due to NAPQI metabolite accumulation.',
    smiles: 'CC(=O)NC1=CC=C(O)C=C1'
  },
  caffeine: {
    name: 'Caffeine',
    use: 'CNS stimulant used in some headache formulations and neonatal apnea management.',
    mechanism: 'Adenosine receptor antagonism increases alertness and neuronal activity.',
    toxic: 'Excessive intake can cause tachycardia, tremor, anxiety, and gastrointestinal upset.',
    smiles: 'Cn1cnc2n(C)c(=O)n(C)c(=O)c12'
  }
};

let viewer;

function renderMoleculeFromData(model) {
  moleculeName.textContent = model.name;
  moleculeUse.innerHTML = `<strong>Clinical use:</strong> ${model.use}`;
  moleculeMech.innerHTML = `<strong>Mechanism:</strong> ${model.mechanism}`;
  moleculeToxic.innerHTML = `<strong>Toxicology note:</strong> ${model.toxic}`;

  if (!window.$3Dmol || !viewer || !model.smiles) return;

  viewer.clear();
  viewer.addModel(model.smiles, 'smi');
  viewer.setStyle({}, { stick: {}, sphere: { scale: 0.28 } });
  viewer.zoomTo();
  viewer.spin(true);
  viewer.render();
}

function renderMolecule(key) {
  renderMoleculeFromData(molecules[key]);
}

function initMoleculeViewer() {
  const element = document.querySelector('#molecule-canvas');
  if (!window.$3Dmol || !element) return;

  viewer = window.$3Dmol.createViewer(element, { backgroundColor: '#0b1220' });
  renderMolecule('aspirin');
}

moleculeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    moleculeButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    renderMolecule(button.dataset.molecule);
  });
});

initMoleculeViewer();

mnemonicFilters.forEach((button) => {
  button.addEventListener('click', () => {
    mnemonicFilters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const selected = button.dataset.category;
    mnemonicCards.forEach((card) => {
      const visible = selected === 'all' || card.dataset.category === selected;
      card.classList.toggle('hidden', !visible);
    });
  });
});

const protocolDefinitions = {
  dissolution: ['Calibrate dissolution apparatus and confirm 37°C medium.', 'Introduce tablets into vessels and start timer.', 'Withdraw aliquots at fixed intervals and replace medium.', 'Analyze absorbance and calculate cumulative drug release.'],
  hplc: ['Prepare mobile phase and equilibrate HPLC column.', 'Prepare standards and sample solutions.', 'Inject standards, then unknown samples.', 'Calculate assay % from peak areas and calibration curve.'],
  sterility: ['Disinfect workbench and arrange sterile consumables.', 'Inoculate samples into fluid thioglycollate and soybean-casein media.', 'Incubate at recommended temperatures for 14 days.', 'Observe turbidity and record contamination status.'],
  'tox-screen': ['Collect biological sample with labeling and chain-of-custody.', 'Perform preliminary immunoassay screen.', 'Run confirmatory chromatography/mass analysis.', 'Interpret report against cut-off and toxic range.'],
  'iv-compounding': ['Verify prescription compatibility and osmolarity.', 'Aseptically withdraw diluent and drug concentrates.', 'Compound admixture in laminar airflow workstation.', 'Label preparation with beyond-use time and monitoring notes.']
};

function updateProtocolControls() {
  sampleCountValue.textContent = sampleCount.value;
  precisionValue.textContent = precisionLevel.value;
}

sampleCount.addEventListener('input', updateProtocolControls);
precisionLevel.addEventListener('input', updateProtocolControls);
updateProtocolControls();

generateProtocolButton.addEventListener('click', () => {
  const type = protocolType.value;
  const steps = protocolDefinitions[type];
  const n = Number(sampleCount.value);
  const precision = Number(precisionLevel.value);

  const completion = Math.max(60, Math.min(99, Math.round(precision * 0.82 + n * 1.3)));
  const quality = Math.max(50, Math.min(99, Math.round(precision * 0.9 - (12 - n) * 1.2)));
  const deviation = Math.max(1, 100 - quality);

  protocolSteps.innerHTML = steps.map((step) => `<li>${step}</li>`).join('');
  protocolSummary.textContent = `Protocol run complete: ${type.replace('-', ' ')} with ${n} samples at ${precision}% precision setting.`;
  protocolResults.innerHTML = `
    <li>Workflow completion score: <strong>${completion}%</strong></li>
    <li>Method quality index: <strong>${quality}%</strong></li>
    <li>Estimated deviation/risk: <strong>${deviation}%</strong></li>
  `;
});
