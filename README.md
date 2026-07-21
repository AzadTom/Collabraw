# 🎨 Collabraw

A real-time collaborative whiteboard inspired by **Excalidraw**, built with **React**, **TypeScript**, **SCSS**, **Konva**, and **Socket.io**. Collabraw enables multiple users to draw, create shapes, add text, and collaborate seamlessly on a shared infinite canvas in real time.

> This repository contains the **frontend** application. The backend server that powers real-time collaboration is available in the Backend Repository linked below.

<p align="center">
  <img src="https://github.com/user-attachments/assets/010d137d-f9f9-4fb2-b998-db0a54b8dca1" alt="Collabraw Banner" width="900">
</p>

<p align="center">
  <a href="https://youtu.be/WM2ciy3OO80?si=CpHmKjQ5eJZEeavZ">
    <img src="https://img.shields.io/badge/▶%20Watch-Demo-red?style=for-the-badge&logo=youtube" alt="Watch Demo">
  </a>
</p>

---
- 🌐 **Live link :** [https://white-board-front-end.vercel.app/](https://white-board-front-end.vercel.app/)
## ✨ Features

* ⚡ Real-time collaborative whiteboard
* 👥 Live collaboration powered by Socket.io
* 📝 Name-based user identification
* 🏠 Automatic room creation and joining
* 👥 Maximum of **5 users per room**
* ✏️ Freehand drawing
* 🔲 Rectangle, Circle, Line, and Arrow tools
* 🔤 Add and edit text on the canvas
* 🎨 Customizable drawing colors
* 🧽 Eraser tool
* ↩️ Undo & Redo
* 🔍 Zoom and Pan canvas
* 📱 Responsive interface
* 🌙 Clean and minimal UI

---

## 🔄 How It Works

1. Open the application and enter your name.
2. The frontend establishes a **Socket.io** connection with the backend.
3. A collaboration room is automatically created or joined.
4. Each room supports **up to 5 participants**.
5. Every drawing action—including freehand strokes, shapes, text, erase, undo, and redo—is synchronized instantly across all connected users.
6. Any user joining or leaving the room is reflected in real time.

---

## 🛠 Tech Stack

### Frontend

* React
* TypeScript
* SCSS
* Konva

### Real-Time Communication

* Socket.io Client

### Icons

* Lucide React

### Build Tool

* Vite

---

## 🔗 Backend Repository

This frontend communicates with a dedicated backend server for real-time collaboration.

**Backend Repository:**
👉 https://github.com/AzadTom/Collabraw-Backend

---

## ⚙️ Getting Started

### Clone the repository

```bash
git clone https://github.com/AzadTom/Collabraw.git

cd Collabraw
```

### Install dependencies

```bash
npm install
```

or

```bash
pnpm install
```

### Configure Environment Variables

Create a `.env` file in the project root.

```env
VITE_SOCKET_URL=http://localhost:5000
```

> Update the URL if your backend is running on a different host or port.

### Start the development server

```bash
npm run dev
```

Visit:

```text
http://localhost:5173
```

---

## 📂 Project Structure

```text
Collabraw
│
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── types/
│   ├── utils/
│   └── main.tsx
├── package.json
└── README.md
```

> Update the folder structure if your project differs.

---

## 🚀 Roadmap

* [ ] Sticky Notes
* [ ] Image Upload
* [ ] Export PNG
* [ ] Export SVG
* [ ] Export PDF
* [ ] Keyboard Shortcuts
* [ ] Comments
* [ ] Voice Chat
* [ ] Shape Libraries
* [ ] Authentication
* [ ] Shared Room Invitations
* [ ] Persistent Whiteboard Storage

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/my-feature
```

3. Commit your changes.

```bash
git commit -m "Add my feature"
```

4. Push your branch.

```bash
git push origin feature/my-feature
```

5. Open a Pull Request.

---

## ⭐ Show Your Support

If you found this project useful, consider giving it a ⭐ on GitHub. It helps others discover the project and supports future development.
