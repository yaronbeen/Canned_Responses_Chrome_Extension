// popup.js - Main extension popup logic

class QuickResponse {
    constructor() {
        this.responses = [];
        this.filteredResponses = [];
        this.selectedIndex = 0;
        this.currentFilter = 'all';
        this.editingId = null;
        
        this.init();
    }

    async init() {
        await this.loadResponses();
        this.setupEventListeners();
        this.renderResponses();
    }

    async loadResponses() {
        const result = await chrome.storage.local.get(['responses']);
        this.responses = result.responses || this.getDefaultResponses();
        this.filteredResponses = [...this.responses];
    }

    getDefaultResponses() {
        return [
            {
                id: Date.now() + 1,
                title: "Welcome Email",
                content: "Hi {{name}},\n\nWelcome to our service! We're excited to have you on board. If you have any questions, don't hesitate to reach out.\n\nBest regards,\n{{your_name}}",
                tags: ["email", "welcome"],
                usage: 0
            },
            {
                id: Date.now() + 2,
                title: "Support Ticket Reply",
                content: "Thank you for contacting support. I understand you're experiencing issues with {{issue}}. Let me help you resolve this.\n\nCould you please provide more details about when this started happening?",
                tags: ["support", "email"],
                usage: 0
            },
            {
                id: Date.now() + 3,
                title: "Meeting Follow-up",
                content: "Hi {{name}},\n\nThank you for taking the time to meet with me on {{date}}. As discussed, here are the next steps:\n\n1. {{action1}}\n2. {{action2}}\n\nLooking forward to our continued collaboration!",
                tags: ["email", "followup"],
                usage: 0
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        
        // Filter tags
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.addEventListener('click', (e) => this.handleFilter(e.target.dataset.filter));
        });
        
        // Add button
        document.getElementById('addBtn').addEventListener('click', () => this.showModal());
        
        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => this.hideModal());
        document.getElementById('responseForm').addEventListener('submit', (e) => this.handleSave(e));
        
        // Click outside modal to close
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') this.hideModal();
        });
        
        // Keyboard shortcuts in search
        searchInput.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleSearch(query) {
        query = query.toLowerCase();
        
        if (!query) {
            this.filteredResponses = this.currentFilter === 'all' 
                ? [...this.responses]
                : this.responses.filter(r => r.tags.includes(this.currentFilter));
        } else {
            this.filteredResponses = this.responses.filter(response => {
                const matchesFilter = this.currentFilter === 'all' || response.tags.includes(this.currentFilter);
                const matchesSearch = response.title.toLowerCase().includes(query) || 
                                    response.content.toLowerCase().includes(query) ||
                                    response.tags.some(tag => tag.includes(query));
                return matchesFilter && matchesSearch;
            });
        }
        
        this.selectedIndex = 0;
        this.renderResponses();
    }

    handleFilter(filter) {
        this.currentFilter = filter;
        
        // Update UI
        document.querySelectorAll('.filter-tag').forEach(tag => {
            tag.classList.toggle('active', tag.dataset.filter === filter);
        });
        
        // Filter responses
        if (filter === 'all') {
            this.filteredResponses = [...this.responses];
        } else {
            this.filteredResponses = this.responses.filter(r => r.tags.includes(filter));
        }
        
        this.renderResponses();
    }

    handleKeyboard(e) {
        const responseItems = document.querySelectorAll('.response-item');
        
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                this.selectedIndex = Math.min(this.selectedIndex + 1, this.filteredResponses.length - 1);
                this.updateSelection();
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
                this.updateSelection();
                break;
                
            case 'Enter':
                e.preventDefault();
                if (this.filteredResponses[this.selectedIndex]) {
                    this.insertResponse(this.filteredResponses[this.selectedIndex]);
                }
                break;
                
            case 'Delete':
                e.preventDefault();
                if (this.filteredResponses[this.selectedIndex]) {
                    this.showDeleteConfirm(this.filteredResponses[this.selectedIndex].id);
                }
                break;
                
            case 'c':
            case 'C':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    if (this.filteredResponses[this.selectedIndex]) {
                        this.copyToClipboard(this.filteredResponses[this.selectedIndex]);
                    }
                }
                break;
        }
    }

    updateSelection() {
        document.querySelectorAll('.response-item').forEach((item, index) => {
            item.classList.toggle('selected', index === this.selectedIndex);
        });
        
        // Scroll selected item into view
        const selectedItem = document.querySelector('.response-item.selected');
        if (selectedItem) {
            selectedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }

    renderResponses() {
        const container = document.getElementById('responsesContainer');
        
        if (this.filteredResponses.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    </svg>
                    <p>No responses found</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.filteredResponses.map((response, index) => `
            <div class="response-item ${index === this.selectedIndex ? 'selected' : ''}" 
                 data-id="${response.id}">
                <div class="response-actions">
                    <button class="action-btn edit" title="Edit" data-action="edit">✏️</button>
                    <button class="action-btn copy" title="Copy to clipboard" data-action="copy">📋</button>
                    <button class="action-btn delete" title="Delete" data-action="delete">🗑️</button>
                </div>
                <div class="response-content">
                    <div class="response-title">
                        ${response.title}
                        ${response.usage > 0 ? `<span style="font-size: 11px; color: #999;">Used ${response.usage}x</span>` : ''}
                    </div>
                    <div class="response-preview">${this.truncateText(response.content, 100)}</div>
                    <div class="response-tags">
                        ${response.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
                <div class="delete-confirm" data-id="${response.id}">
                    <span>Delete this response?</span>
                    <button class="confirm-yes">Delete</button>
                    <button class="confirm-no">Cancel</button>
                </div>
            </div>
        `).join('');
        
        // Add click listeners
        container.querySelectorAll('.response-item').forEach((item, index) => {
            const response = this.filteredResponses[index];
            
            // Main click to insert
            item.querySelector('.response-content').addEventListener('click', () => {
                this.insertResponse(response);
            });
            
            // Action buttons
            item.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    
                    switch(action) {
                        case 'edit':
                            this.editResponse(response);
                            break;
                        case 'copy':
                            this.copyToClipboard(response);
                            break;
                        case 'delete':
                            this.showDeleteConfirm(response.id);
                            break;
                    }
                });
            });
            
            // Delete confirmation buttons
            const deleteConfirm = item.querySelector('.delete-confirm');
            deleteConfirm.querySelector('.confirm-yes').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteResponse(response.id);
            });
            
            deleteConfirm.querySelector('.confirm-no').addEventListener('click', (e) => {
                e.stopPropagation();
                this.hideDeleteConfirm(response.id);
            });
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    async insertResponse(response) {
        // Update usage count
        response.usage = (response.usage || 0) + 1;
        await this.saveResponses();
        
        // Get active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Check for variables in the response
        const variables = this.extractVariables(response.content);
        
        if (variables.length > 0) {
            // For now, we'll insert with placeholder variables
            // In a full implementation, you'd show a form to fill these
            chrome.tabs.sendMessage(tab.id, {
                action: 'insert',
                content: response.content
            });
        } else {
            chrome.tabs.sendMessage(tab.id, {
                action: 'insert',
                content: response.content
            });
        }
        
        // Close popup
        window.close();
    }

    extractVariables(content) {
        const regex = /\{\{(\w+)\}\}/g;
        const variables = [];
        let match;
        
        while ((match = regex.exec(content)) !== null) {
            if (!variables.includes(match[1])) {
                variables.push(match[1]);
            }
        }
        
        return variables;
    }

    showModal(response = null) {
        this.editingId = response ? response.id : null;
        
        document.getElementById('modalTitle').textContent = response ? 'Edit Response' : 'Add Response';
        document.getElementById('title').value = response ? response.title : '';
        document.getElementById('content').value = response ? response.content : '';
        document.getElementById('tags').value = response ? response.tags.join(', ') : '';
        
        document.getElementById('modal').style.display = 'block';
        document.getElementById('title').focus();
    }

    hideModal() {
        document.getElementById('modal').style.display = 'none';
        this.editingId = null;
    }

    editResponse(response) {
        this.showModal(response);
    }

    async handleSave(e) {
        e.preventDefault();
        
        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();
        const tags = document.getElementById('tags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);
        
        if (!title || !content) return;
        
        if (this.editingId) {
            // Update existing response
            const index = this.responses.findIndex(r => r.id === this.editingId);
            if (index !== -1) {
                this.responses[index] = {
                    ...this.responses[index],
                    title,
                    content,
                    tags
                };
            }
        } else {
            // Add new response
            this.responses.unshift({
                id: Date.now(),
                title,
                content,
                tags,
                usage: 0
            });
        }
        
        await this.saveResponses();
        this.filteredResponses = [...this.responses];
        this.renderResponses();
        this.hideModal();
    }

    async saveResponses() {
        await chrome.storage.local.set({ responses: this.responses });
    }

    copyToClipboard(response) {
        // Create a textarea to copy the content
        const textarea = document.createElement('textarea');
        textarea.value = response.content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show toast notification
        this.showToast('Copied to clipboard!');
    }

    showDeleteConfirm(responseId) {
        const confirmDiv = document.querySelector(`.delete-confirm[data-id="${responseId}"]`);
        if (confirmDiv) {
            confirmDiv.classList.add('show');
        }
    }

    hideDeleteConfirm(responseId) {
        const confirmDiv = document.querySelector(`.delete-confirm[data-id="${responseId}"]`);
        if (confirmDiv) {
            confirmDiv.classList.remove('show');
        }
    }

    async deleteResponse(responseId) {
        // Remove from responses array
        this.responses = this.responses.filter(r => r.id !== responseId);
        this.filteredResponses = this.filteredResponses.filter(r => r.id !== responseId);
        
        // Save and re-render
        await this.saveResponses();
        this.renderResponses();
        
        // Show toast
        this.showToast('Response deleted');
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
}

// Initialize the extension
new QuickResponse();