/**
 * Conference Program Renderer
 * Renders program data from JSON into the program section while preserving existing structure
 */
class ProgramRenderer {
    constructor(containerSelector, dataUrl) {
        this.container = document.querySelector(containerSelector);
        this.dataUrl = dataUrl;
        this.data = null;
    }

    /**
     * Initialize the program renderer
     */
    async init() {
        try {
            await this.loadData();
            this.render();
            this.setupTabs();
        } catch (error) {
            console.error('Failed to initialize program:', error);
        }
    }

    /**
     * Load program data from JSON file
     */
    async loadData() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            this.data = await response.json();
        } catch (error) {
            console.error('Error loading program data:', error);
            throw error;
        }
    }

    /**
     * Render the program data into the container
     */
    render() {
        if (!this.data || !this.container) return;

        // Update header with event dates
        const headerEl = document.querySelector('#program .section-header p');
        if (headerEl) {
            headerEl.textContent = `${this.data.eventDates.startDate}-${this.data.eventDates.endDate}, ${this.data.eventDates.year} | ${this.data.eventDates.location}`;
        }

        // Find or create program tabs container
        let programTabs = this.container.querySelector('.program-tabs');
        if (!programTabs) {
            programTabs = document.createElement('div');
            programTabs.className = 'program-tabs';
            this.container.querySelector('.section-content').appendChild(programTabs);
        }

        // Create or update tab buttons
        let tabButtons = programTabs.querySelector('.tab-buttons');
        if (!tabButtons) {
            tabButtons = document.createElement('div');
            tabButtons.className = 'tab-buttons';
            programTabs.appendChild(tabButtons);
        } else {
            tabButtons.innerHTML = ''; // Clear existing buttons
        }

        // Create tab buttons for each day
        this.data.days.forEach((day, index) => {
            const button = document.createElement('button');
            button.className = `tab-btn ${index === 0 ? 'active' : ''}`;
            button.setAttribute('data-tab', day.id);
            button.textContent = day.label;
            tabButtons.appendChild(button);
            
            // Find or create tab content
            let tabContent = programTabs.querySelector(`#${day.id}`);
            if (!tabContent) {
                tabContent = document.createElement('div');
                tabContent.className = `tab-content ${index === 0 ? 'active' : ''}`;
                tabContent.id = day.id;
                programTabs.appendChild(tabContent);
            } else {
                tabContent.innerHTML = ''; // Clear existing content
                tabContent.className = `tab-content ${index === 0 ? 'active' : ''}`;
            }
            
            // Create schedule container
            const schedule = document.createElement('div');
            schedule.className = 'schedule';
            
            // Render schedule items
            day.schedule.forEach(item => {
                switch(item.type) {
                    case 'keynote':
                        schedule.appendChild(this.createKeynote(item));
                        break;
                    case 'session-group':
                        schedule.appendChild(this.createSessionGroup(item));
                        break;
                    case 'parallel-session':
                        schedule.appendChild(this.createParallelSession(item));
                        break;
                    case 'social':
                        schedule.appendChild(this.createSocialEvent(item));
                        break;
                    default:
                        console.warn(`Unknown schedule item type: ${item.type}`);
                }
            });
            
            tabContent.appendChild(schedule);
        });
    }

    /**
     * Create a keynote session element
     */
    createKeynote(item) {
        const keynote = document.createElement('div');
        keynote.className = 'schedule-item keynote';
        keynote.innerHTML = `
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-details">
                <div class="badge">Keynote</div>
                <h4>${item.title}</h4>
                <p class="speaker">${item.speaker}</p>
                <p>${item.description}</p>
            </div>
        `;
        return keynote;
    }

    /**
     * Create a session group title
     */
    createSessionGroup(item) {
        const group = document.createElement('h4');
        group.className = 'session-group-title';
        group.textContent = item.title;
        return group;
    }

    /**
     * Create a parallel session element with the structure that supports collapsible functionality
     */
    createParallelSession(item) {
        const session = document.createElement('div');
        session.className = 'schedule-item';
        
        const sessionContent = `
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-details">
                <h4>${item.sessionTitle}</h4>
                <p class="session-chair">Chair: ${item.chair}</p>
                ${item.presentations.map(pres => `
                    <div class="session-item">
                        <p class="session-time">${pres.time}</p>
                        <p class="session-title">${pres.title}</p>
                        <p class="session-authors">${pres.authors}</p>
                    </div>
                `).join('')}
            </div>
        `;
        
        session.innerHTML = sessionContent;
        return session;
    }

    /**
     * Create a social event element
     */
    createSocialEvent(item) {
        const social = document.createElement('div');
        social.className = 'schedule-item social';
        social.innerHTML = `
            <div class="schedule-time">${item.time}</div>
            <div class="schedule-details">
                <h4>${item.title}</h4>
                <p>${item.description}</p>
            </div>
        `;
        return social;
    }

    /**
     * Setup tab functionality
     */
    setupTabs() {
        const tabBtns = this.container.querySelectorAll('.tab-btn');
        const tabContents = this.container.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                
                // Remove active class from all buttons and contents
                tabBtns.forEach(tb => tb.classList.remove('active'));
                tabContents.forEach(tc => tc.classList.remove('active'));
                
                // Add active class to current button and content
                btn.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
}
