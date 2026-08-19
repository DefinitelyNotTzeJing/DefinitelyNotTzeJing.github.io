const projects = {
    phantom: {
        cat: "GAME DEVELOPMENT · 2026",
        title: "Phantom Echoes",
        desc: "A third-person psychological thriller focused on exploration, memory fragments, puzzle solving, and unique boss encounters.",
        tools: "UNITY · C# · BLENDER"
    },

    modeling: {
        cat: "3D ART · 2026",
        title: "3D Modeling Projects",
        desc: "A collection of 3D models, props, environments, and assets created for academic and personal projects.",
        tools: "BLENDER · 3D MODELING"
    },

    animation: {
        cat: "ANIMATION · 2025",
        title: "Animation Projects",
        desc: "Animation and interactive media work created throughout the Animation and Game Development course.",
        tools: "BLENDER · UNITY"
    }
};


// ==============================
// MOBILE NAVIGATION
// ==============================

const nav = document.querySelector("#nav");
const menuBtn = document.querySelector("#menuBtn");

menuBtn.onclick = () => {
    nav.classList.toggle("open");
};

document.querySelectorAll("nav a").forEach((link) => {
    link.onclick = () => {
        nav.classList.remove("open");
    };
});


// ==============================
// PROJECT MODAL
// ==============================

const modal = document.querySelector("#modal");
const closeButton = document.querySelector("#close");

document.querySelectorAll(".open").forEach((button) => {

    button.onclick = () => {

        const project = projects[button.dataset.id];

        if (!project) return;

        document.querySelector("#mcat").textContent = project.cat;
        document.querySelector("#mtitle").textContent = project.title;
        document.querySelector("#mdesc").textContent = project.desc;
        document.querySelector("#mtools").textContent = project.tools;

        modal.classList.add("show");
    };

});


// Close modal
closeButton.onclick = () => {
    modal.classList.remove("show");
};


// Close modal when clicking outside the content
modal.onclick = (event) => {

    if (event.target === modal) {
        modal.classList.remove("show");
    }

};


// Close modal with ESC
document.onkeydown = (event) => {

    if (event.key === "Escape") {
        modal.classList.remove("show");
    }

};


// ==============================
// CONTACT FORM
// ==============================

const contactForm = document.querySelector("#contactForm");

contactForm.onsubmit = (event) => {

    event.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    const subject = encodeURIComponent(
        `Portfolio inquiry from ${data.name}`
    );

    const body = encodeURIComponent(
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n\n` +
        `${data.message}`
    );

    window.location.href =
        `mailto:your@email.com?subject=${subject}&body=${body}`;

    document.querySelector("#status").textContent =
        "OPENING YOUR EMAIL APP...";
};