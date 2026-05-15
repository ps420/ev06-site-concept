const SITE_CONFIG = {
  brandName: 'EV06',
  productLabel: '4G Safety Watch',
  contactEmail: 'sales@example.com',
  demoSubject: 'EV06 Website / Device Enquiry',
};

const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');
const revealItems = document.querySelectorAll('.reveal');
const leadForm = document.querySelector('#leadForm');
const mailtoLink = document.querySelector('#mailtoLink');
const formStatus = document.querySelector('#formStatus');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(nav.classList.contains('open')));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (revealItems.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function getFormData(form) {
  const data = new FormData(form);
  return {
    name: String(data.get('name') || '').trim(),
    company: String(data.get('company') || '').trim(),
    email: String(data.get('email') || '').trim(),
    message: String(data.get('message') || '').trim(),
  };
}

function buildMessage(values) {
  return [
    `Enquiry for: ${SITE_CONFIG.brandName} ${SITE_CONFIG.productLabel}`,
    `Name: ${values.name || 'Not provided'}`,
    `Company / use case: ${values.company || 'Not provided'}`,
    `Email: ${values.email || 'Not provided'}`,
    '',
    values.message || 'No additional message provided.',
  ].join('\n');
}

function buildMailto(values) {
  const subject = encodeURIComponent(SITE_CONFIG.demoSubject);
  const body = encodeURIComponent(buildMessage(values));
  return `mailto:${SITE_CONFIG.contactEmail}?subject=${subject}&body=${body}`;
}

function updateMailtoLink() {
  if (!leadForm || !mailtoLink) return;
  const values = getFormData(leadForm);
  mailtoLink.href = buildMailto(values);
}

function setStatus(message) {
  if (!formStatus) return;
  formStatus.textContent = message;
}

if (leadForm) {
  ['input', 'change'].forEach((eventName) => {
    leadForm.addEventListener(eventName, updateMailtoLink);
  });

  updateMailtoLink();

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const values = getFormData(leadForm);

    if (!values.name) {
      setStatus('Add a name first so the enquiry is usable.');
      return;
    }

    const message = buildMessage(values);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
        setStatus('Enquiry copied to clipboard. The email draft link is ready too.');
      } else {
        setStatus('Enquiry prepared. Use the email draft button below.');
      }
    } catch {
      setStatus('Enquiry prepared. Use the email draft button below.');
    }

    updateMailtoLink();
  });
}
