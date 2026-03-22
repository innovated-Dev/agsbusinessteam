const projects = [
    {
        section_number: '01',
        section_title: 'Design Projects',
        section_desc: 'Browse our design work — where every visual tells a brand story, stops the scroll, and turns first impressions into lasting client relationships',
        section_link: 'https://drive.google.com/drive/folders/1wNxkp8qr54ixUuAF16xuPYX2idiXNphS?usp=sharing'
    },
    {
        section_number: '02',
        section_title: 'Growth Marketing',
        section_desc: 'From first click to loyal customer — we build campaigns, funnels, and growth experiments backed by real data. Email sequences, landing pages, A/B tests, and strategies engineered to acquire, convert, and retain at scale.',
        section_link: 'mini2.html'
    },
    {
        section_number: '03',
        section_title: 'Web Development & Saas',
        section_desc: 'From landing pages to full SaaS platforms — browse the websites and web apps AGS has engineered to perform, convert, and scale for businesses that refuse to settle for ordinary.',
        section_link: 'mini.html'
    }
]

const container = document.getElementById('portfolioItems');
console.log(container)

for (let index = 0; index < 3; index++) {
    const div = document.createElement('div');
    div.className = 'section';

    const list = projects[index];

    div.innerHTML = `
        <span class="section-number">${list.section_number}</span>
        <div class="section-body">
        <h2 class="section-title">${list.section_title}</h2>
        <p class="section-desc">${list.section_desc}</p>
        <a href=${list.section_link} class="section-link">Check out the projects <span class="arrow">→</span></a>
        </div>
    `;
    container.appendChild(div);
}