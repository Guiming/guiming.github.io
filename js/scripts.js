/*!
* Start Bootstrap - Resume v7.0.4 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/

window.addEventListener('DOMContentLoaded', () => {
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav && typeof bootstrap !== 'undefined') {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 74,
        });
    }

    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = Array.from(document.querySelectorAll('#navbarResponsive .nav-link'));
    responsiveNavItems.forEach((responsiveNavItem) => {
        responsiveNavItem.addEventListener('click', () => {
            if (navbarToggler && window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    const slugify = (value) => value
        .toLowerCase()
        .trim()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

    const publicationNumber = (entry) => {
        const numberNode = Array.from(entry.querySelectorAll('b')).find((node) => /^\d+$/.test(node.textContent.trim()));
        return numberNode ? Number(numberNode.textContent.trim()) : null;
    };

    const publicationYear = (entry) => {
        const match = entry.textContent.match(/\((19|20)\d{2}\)/);
        return match ? match[0].slice(1, -1) : 'Other';
    };

    const publicationTitle = (entry) => {
        const text = entry.textContent.replace(/\s+/g, ' ').trim();
        const yearMatch = text.match(/\((19|20)\d{2}\)/);
        if (!yearMatch) return `Publication ${publicationNumber(entry)}`;

        let title = text.slice(yearMatch.index + yearMatch[0].length).replace(/^[.)\s]+/, '');
        const venue = entry.querySelector('i');
        if (venue) {
            const venueIndex = title.indexOf(venue.textContent.trim());
            if (venueIndex > 0) title = title.slice(0, venueIndex);
        }
        return title.replace(/[.\s]+$/, '') || `Publication ${publicationNumber(entry)}`;
    };

    const publicationLabel = (entry, number) => {
        const match = entry.innerHTML.match(/^\s*(\[[\s\S]*?<b>\s*\d+\s*<\/b>\])/i);
        return match ? match[1] : `<strong>#${number}</strong>`;
    };

    const publicationEntries = new Map();

    const organizePublicationSection = (container) => {
        const entries = Array.from(container.children).filter((child) =>
            child.matches('div.mb-3') && publicationNumber(child)
        );
        if (!entries.length) return;

        const groups = new Map();
        entries.forEach((entry) => {
            const number = publicationNumber(entry);
            const year = publicationYear(entry);
            entry.id = `publication-${number}`;
            entry.classList.add('publication-entry');
            publicationEntries.set(number, entry);
            if (!groups.has(year)) groups.set(year, []);
            groups.get(year).push(entry);
        });

        Array.from(container.children).forEach((child) => {
            if (child.tagName === 'BR') child.remove();
        });

        const yearContainer = document.createElement('div');
        yearContainer.className = 'publication-years';
        groups.forEach((yearEntries, year) => {
            const details = document.createElement('details');
            details.className = 'year-group publication-year';
            details.open = true;
            details.dataset.year = year;

            const summary = document.createElement('summary');
            const countLabel = `${yearEntries.length} ${yearEntries.length === 1 ? 'entry' : 'entries'}`;
            summary.innerHTML = `<span>${year}</span><span class="year-count">${countLabel}</span>`;

            const content = document.createElement('div');
            content.className = 'year-content';
            yearEntries.forEach((entry) => content.appendChild(entry));

            details.append(summary, content);
            yearContainer.appendChild(details);
        });
        container.appendChild(yearContainer);
    };

    document.querySelectorAll('#publications .resume-content').forEach((container) => {
        const heading = container.querySelector(':scope > h3');
        if (!heading) return;
        const title = heading.textContent.trim();
        if (title === 'Refereed Journal Articles' || title === 'Refereed Book Chapters') {
            organizePublicationSection(container);
        }
    });

    document.querySelectorAll('[data-publication-action]').forEach((button) => {
        button.addEventListener('click', () => {
            const shouldOpen = button.dataset.publicationAction === 'expand';
            document.querySelectorAll('#publications details.publication-year').forEach((details) => {
                details.open = shouldOpen;
            });
        });
    });

    const researchGroups = {
        'Volunteered Geographic Information': {
            core: [38, 35, 32, 31, 30, 29, 26, 25, 23, 21, 20, 19, 17, 15, 14, 13, 10, 2],
            additional: [39, 33, 28, 8],
        },
        'Social Sensing': {
            core: [39, 33, 32, 29, 28, 8],
            additional: [38, 35, 31, 30, 20],
        },
        'Geovisualization and Geovisual Analytics': {
            core: [36, 32, 31, 23],
            additional: [29, 28, 26, 20, 9],
        },
        'Environmental Modeling': {
            core: [37, 36, 34, 25, 24, 22, 18, 16, 15, 14, 12, 11, 1],
            additional: [27, 5, 4, 3],
        },
        'Geospatial Artificial Intelligence': {
            core: [37, 34],
            additional: [],
        },
        'Geo-computation': {
            core: [26, 24, 23, 22, 7, 6],
            additional: [8, 5],
        },
        'Other Topics': {
            core: [9],
            additional: [],
        },
    };

    const makeResearchList = (entries) => {
        const list = document.createElement('ul');
        list.className = 'research-publication-list';
        entries.forEach((entry) => {
            const number = publicationNumber(entry);
            const item = document.createElement('li');
            item.innerHTML = `<span class="publication-label">${publicationLabel(entry, number)}</span> <a href="#publication-${number}">${publicationTitle(entry)}</a> <span class="text-muted">(${publicationYear(entry)})</span>`;
            list.appendChild(item);
        });
        return list;
    };

    const researchSection = document.querySelector('#researcharea');
    const researchNavigation = document.querySelector('#research-area-links');
    if (researchSection && researchNavigation) {
        const headings = Array.from(researchSection.querySelectorAll('h3'));
        headings.forEach((heading) => {
            const area = heading.textContent.trim();
            const slug = slugify(area);
            heading.id = slug;

            const navLink = document.createElement('a');
            navLink.href = `#${slug}`;
            navLink.textContent = area;
            researchNavigation.appendChild(navLink);

            const siblings = Array.from(heading.parentElement.children);
            const headingIndex = siblings.indexOf(heading);
            const nextHeadingIndex = siblings.findIndex((node, index) => index > headingIndex && node.tagName === 'H3');
            const areaNodes = siblings.slice(headingIndex + 1, nextHeadingIndex === -1 ? undefined : nextHeadingIndex);
            const citations = areaNodes.filter((node) => node.matches('div.mb-3') && publicationNumber(node));
            if (!citations.length) return;

            const classification = researchGroups[area] || { core: citations.map(publicationNumber), additional: [] };
            const coreSet = new Set(classification.core);
            const additionalSet = new Set(classification.additional);
            const coreEntries = citations.filter((entry) => coreSet.has(publicationNumber(entry)));
            const additionalEntries = citations.filter((entry) => additionalSet.has(publicationNumber(entry)));
            citations.forEach((entry) => {
                if (!coreSet.has(publicationNumber(entry)) && !additionalSet.has(publicationNumber(entry))) {
                    coreEntries.push(entry);
                }
            });

            const groups = document.createElement('div');
            groups.className = 'research-publication-groups';

            const coreHeading = document.createElement('h4');
            coreHeading.textContent = 'Core Publications';
            groups.append(coreHeading, makeResearchList(coreEntries));

            if (additionalEntries.length) {
                const additional = document.createElement('details');
                additional.className = 'additional-publications';
                const summary = document.createElement('summary');
                summary.textContent = `Additional Relevant Publications (${additionalEntries.length})`;
                additional.append(summary, makeResearchList(additionalEntries));
                groups.appendChild(additional);
            }

            heading.parentElement.insertBefore(groups, citations[0]);
            citations.forEach((entry) => entry.remove());
        });
    }

    const revealPublication = (hash) => {
        if (!hash || !hash.startsWith('#publication-')) return;
        const target = document.querySelector(hash);
        const parentDetails = target ? target.closest('details') : null;
        if (parentDetails) parentDetails.open = true;
    };

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a[href^="#publication-"]');
        if (link) revealPublication(link.getAttribute('href'));
    });
    revealPublication(window.location.hash);

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        const updateBackToTop = () => backToTop.classList.toggle('is-visible', window.scrollY > 600);
        window.addEventListener('scroll', updateBackToTop, { passive: true });
        updateBackToTop();
    }
});
