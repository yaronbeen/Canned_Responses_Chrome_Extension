 Lightning-fast canned responses for Chrome</h3>
Save hours typing repetitive messages with smart templates, dynamic variables, and instant search

---

## ✨ Features

- 🔍 **Smart Search** - Find responses instantly with fuzzy search
- 🏷️ **Tag-based Filtering** - Organize responses with custom tags
- 📝 **Dynamic Variables** - Use {{name}}, {{date}}, {{company}} placeholders
- ⌨️ **Keyboard Shortcuts** - Navigate with arrows, insert with Enter
- 📊 **Usage Analytics** - Track your most-used responses
- 🎨 **Beautiful UI** - Modern, clean interface with smooth animations
- 📋 **Quick Actions** - Copy, edit, or delete responses with one click
- 🔄 **Import/Export** - Backup and share your response library

## 🚀 Installation

### From Source (Recommended for Developers)

1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/quickresponse-pro.git
   cd quickresponse-pro
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable **Developer mode** (toggle in top right)

4. Click **Load unpacked** and select the cloned directory

5. The extension icon should appear in your toolbar!

### From Chrome Web Store
*Coming soon!*

## 📖 Usage

### Opening QuickResponse
- Click the extension icon in your toolbar
- Use keyboard shortcut `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Right-click in any text field and select "Insert Quick Response"

### Managing Responses
- **Add**: Click the + button to create a new response
- **Edit**: Click the ✏️ icon on any response
- **Delete**: Click the 🗑️ icon (with confirmation)
- **Copy**: Click the 📋 icon to copy response text

### Using Variables
Add dynamic placeholders to your responses:
```
Hi {{name}},

Thank you for reaching out on {{date}}. 
I'll get back to you about {{topic}} shortly.

Best regards,
{{your_name}}
```

### Keyboard Shortcuts
- `Ctrl+Shift+R` - Open QuickResponse
- `↑↓` Arrow keys - Navigate responses
- `Enter` - Insert selected response
- `Delete` - Delete selected response
- `Ctrl+C` - Copy selected response

## 🛠️ Development

### Project Structure
```
quickresponse-pro/
├── manifest.json       # Extension configuration
├── popup.html         # Popup interface
├── popup.js           # Popup logic
├── content.js         # Content script for text insertion
├── background.js      # Service worker
├── icon-16.png        # Extension icons
├── icon-48.png
└── icon-128.png
```

### Building from Source
No build process required! This is a vanilla JavaScript extension.

### Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔮 Roadmap

- [ ] Cloud sync across devices
- [ ] Team sharing capabilities
- [ ] AI-powered response suggestions
- [ ] Rich text formatting
- [ ] Response templates marketplace
- [ ] Firefox and Edge support
- [ ] Slack/Discord/Teams integration

## 🤝 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/quickresponse-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/quickresponse-pro/discussions)
- **Email**: your.email@example.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with vanilla JavaScript for maximum performance
- Icons from Emoji for simplicity and universal support
- Inspired by the need to stop typing the same things over and over

---

<div align="center">
  <p>If you find this extension helpful, please ⭐ star this repository!</p>
  <a href="https://www.buymeacoffee.com/yourusername">
    <img src="https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee">
  </a>
</div>
