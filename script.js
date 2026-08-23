/*
 * ==========================================
 * ABUBAKAR // DIGITAL UNIVERSE
 * STEP 4 — SCROLL / CAMERA SYSTEM
 * ==========================================
 */

"use strict";

import * as THREE from "three";


/*
 * ==========================================
 * DOM READY
 * ==========================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const container =
            document.getElementById(
                "hero-canvas"
            );


        if (!container) {

            console.error(
                "Hero canvas container was not found."
            );

            return;
        }


        initHeroScene(container);

        initAboutReveal();

        initEngineeringFlow();

    }
);


/*
 * ==========================================
 * HERO SCENE
 * ==========================================
 */

function initHeroScene(container) {

    /*
     * ======================================
     * SCENE
     * ======================================
     */

    const scene =
        new THREE.Scene();


    /*
     * ======================================
     * CAMERA
     * ======================================
 */

    const camera =
        new THREE.PerspectiveCamera(
            45,
            container.clientWidth /
                container.clientHeight,
            0.1,
            100
        );


    /*
     * Base camera position.
     */

    const baseCameraZ = 7;


    camera.position.set(
        0,
        0,
        baseCameraZ
    );


    /*
     * ======================================
     * RENDERER
     * ======================================
     */

    const renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference:
                "high-performance"
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );


    renderer.outputColorSpace =
        THREE.SRGBColorSpace;


    container.appendChild(
        renderer.domElement
    );


    /*
     * ======================================
     * LIGHTING
     * ======================================
 */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.2
        );


    scene.add(
        ambientLight
    );


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            2
        );


    keyLight.position.set(
        4,
        5,
        6
    );


    scene.add(
        keyLight
    );


    const rimLight =
        new THREE.PointLight(
            0xffffff,
            18,
            20
        );


    rimLight.position.set(
        -4,
        2,
        4
    );


    scene.add(
        rimLight
    );


    /*
     * ======================================
     * MAIN CORE
     * ======================================
     */

    const coreGeometry =
        new THREE.IcosahedronGeometry(
            1.25,
            2
        );


    const coreMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.75,
            roughness: 0.22,
            transparent: true,
            opacity: 0.92
        });


    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );


    scene.add(
        core
    );


    /*
     * ======================================
     * INNER CORE
     * ======================================
     */

    const innerGeometry =
        new THREE.IcosahedronGeometry(
            0.72,
            1
        );


    const innerMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });


    const innerCore =
        new THREE.Mesh(
            innerGeometry,
            innerMaterial
        );


    scene.add(
        innerCore
    );


    /*
     * ======================================
     * ORBIT RING
     * ======================================
     */

    const ringGeometry =
        new THREE.TorusGeometry(
            1.75,
            0.012,
            16,
            160
        );


    const ringMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });


    const ring =
        new THREE.Mesh(
            ringGeometry,
            ringMaterial
        );


    ring.rotation.x =
        Math.PI * 0.35;


    ring.rotation.y =
        Math.PI * 0.15;


    scene.add(
        ring
    );


    /*
     * ======================================
     * SECOND RING
     * ======================================
     */

    const secondRingGeometry =
        new THREE.TorusGeometry(
            2.05,
            0.008,
            16,
            160
        );


    const secondRing =
        new THREE.Mesh(
            secondRingGeometry,
            ringMaterial
        );


    secondRing.rotation.x =
        Math.PI * 0.65;


    secondRing.rotation.z =
        Math.PI * 0.2;


    scene.add(
        secondRing
    );


    /*
     * ======================================
     * PARTICLES
     * ======================================
     */

    const particleCount =
        900;


    const particlePositions =
        new Float32Array(
            particleCount * 3
        );


    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const i3 =
            i * 3;


        particlePositions[i3] =
            (
                Math.random() -
                0.5
            ) * 22;


        particlePositions[i3 + 1] =
            (
                Math.random() -
                0.5
            ) * 14;


        particlePositions[i3 + 2] =
            (
                Math.random() -
                0.5
            ) * 18;
    }


    const particleGeometry =
        new THREE.BufferGeometry();


    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            particlePositions,
            3
        )
    );


    const particleMaterial =
        new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.018,
            transparent: true,
            opacity: 0.45,
            depthWrite: false
        });


    const particles =
        new THREE.Points(
            particleGeometry,
            particleMaterial
        );


    scene.add(
        particles
    );


    /*
     * ======================================
     * GLOW
     * ======================================
     */

    const glowGeometry =
        new THREE.SphereGeometry(
            1.65,
            32,
            32
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.025,
            depthWrite: false
        });


    const glow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );


    scene.add(
        glow
    );


    /*
     * ======================================
     * POINTER STATE
     * ======================================
     */

    const pointer = {

        currentX: 0,
        currentY: 0,

        targetX: 0,
        targetY: 0

    };


    /*
     * ======================================
     * SCROLL STATE
     * ======================================
     */

    const scroll = {

        current: 0,

        target: 0

    };


    /*
     * ======================================
     * REDUCED MOTION
     * ======================================
     */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /*
     * ======================================
     * POINTER
     * ======================================
     */

    function handlePointerMove(event) {

        if (
            prefersReducedMotion ||
            window.innerWidth < 768
        ) {
            return;
        }


        pointer.targetX =
            (
                event.clientX /
                window.innerWidth
            ) * 2 - 1;


        pointer.targetY =
            -(
                event.clientY /
                window.innerHeight
            ) * 2 + 1;

    }


    window.addEventListener(
        "pointermove",
        handlePointerMove,
        {
            passive: true
        }
    );


    /*
     * ======================================
     * POINTER RESET
     * ======================================
     */

    function resetPointer() {

        pointer.targetX = 0;

        pointer.targetY = 0;

    }


    document.addEventListener(
        "mouseleave",
        resetPointer
    );


    /*
     * ======================================
     * SCROLL TARGET
     * ======================================
     */

    function updateScrollTarget() {

        const heroHeight =
            window.innerHeight;


        const rawProgress =
            window.scrollY /
            heroHeight;


        /*
         * Only use the first hero
         * scroll journey.
         */

        scroll.target =
            THREE.MathUtils.clamp(
                rawProgress,
                0,
                1
            );

    }


    window.addEventListener(
        "scroll",
        updateScrollTarget,
        {
            passive: true
        }
    );


    /*
     * ======================================
     * ANIMATION
     * ======================================
     */

    let animationFrameId = null;

    let previousTime = 0;


    function animate(time) {

        animationFrameId =
            requestAnimationFrame(
                animate
            );


        const delta =
            Math.min(
                (
                    time -
                    previousTime
                ) / 1000,
                0.05
            );


        previousTime =
            time;


        /*
         * ==================================
         * SMOOTH POINTER
         * ==================================
         */

        pointer.currentX +=
            (
                pointer.targetX -
                pointer.currentX
            ) * 0.045;


        pointer.currentY +=
            (
                pointer.targetY -
                pointer.currentY
            ) * 0.045;


        /*
         * ==================================
         * SMOOTH SCROLL
         * ==================================
         */

        scroll.current +=
            (
                scroll.target -
                scroll.current
            ) * 0.055;


        /*
         * ==================================
         * BASE ROTATION
         * ==================================
         */

        core.rotation.x +=
            delta * 0.18;


        core.rotation.y +=
            delta * 0.28;


        innerCore.rotation.x -=
            delta * 0.22;


        innerCore.rotation.y +=
            delta * 0.35;


        /*
         * ==================================
         * POINTER ROTATION
         * ==================================
         */

        if (
            !prefersReducedMotion
        ) {

            core.rotation.y +=
                pointer.currentX *
                delta *
                0.8;


            core.rotation.x +=
                pointer.currentY *
                delta *
                0.5;


            innerCore.rotation.y +=
                pointer.currentX *
                delta *
                0.5;


            innerCore.rotation.x +=
                pointer.currentY *
                delta *
                0.3;

        }


        /*
         * ==================================
         * CAMERA PARALLAX
         * ==================================
         */

        const cameraTargetX =
            pointer.currentX *
            0.22;


        const cameraTargetY =
            pointer.currentY *
            0.12;


        /*
         * ==================================
         * CAMERA SCROLL MOVEMENT
         * ==================================
         *
         * At scroll 0:
         *
         * camera Z = 7
         *
         * At scroll 1:
         *
         * camera moves toward
         * the 3D environment.
         */

        const scrollCameraZ =
            baseCameraZ -
            (
                scroll.current *
                2.15
            );


        const finalCameraX =
            cameraTargetX +
            (
                scroll.current *
                0.35
            );


        const finalCameraY =
            cameraTargetY -
            (
                scroll.current *
                0.15
            );


        camera.position.x +=
            (
                finalCameraX -
                camera.position.x
            ) * 0.035;


        camera.position.y +=
            (
                finalCameraY -
                camera.position.y
            ) * 0.035;


        camera.position.z +=
            (
                scrollCameraZ -
                camera.position.z
            ) * 0.045;


        camera.lookAt(
            0,
            0,
            0
        );


        /*
         * ==================================
         * OBJECT SCALE
         * ==================================
         */

        const scale =
            1 +
            (
                scroll.current *
                0.18
            );


        core.scale.setScalar(
            scale
        );


        innerCore.scale.setScalar(
            scale
        );


        glow.scale.setScalar(
            scale
        );


        /*
         * ==================================
         * ORBITS
         * ==================================
         */

        ring.rotation.z +=
            delta *
            (
                0.12 +
                scroll.current * 0.35
            );


        secondRing.rotation.x +=
            delta *
            (
                0.08 +
                scroll.current * 0.25
            );


        secondRing.rotation.y -=
            delta *
            (
                0.14 +
                scroll.current * 0.3
            );


        /*
         * ==================================
         * PARTICLES
         * ==================================
         */

        particles.rotation.y +=
            delta *
            (
                0.008 +
                scroll.current * 0.025
            );


        particles.rotation.x +=
            delta *
            (
                0.003 +
                scroll.current * 0.01
            );


        if (
            !prefersReducedMotion
        ) {

            particles.position.x +=
                (
                    pointer.currentX * 0.08 -
                    particles.position.x
                ) * 0.01;


            particles.position.y +=
                (
                    pointer.currentY * 0.05 -
                    particles.position.y
                ) * 0.01;

        }


        /*
         * ==================================
         * FLOATING MOTION
         * ==================================
         */

        const floatAmount =
            Math.sin(
                time * 0.0007
            ) * 0.06;


        core.position.y =
            floatAmount;


        innerCore.position.y =
            floatAmount;


        glow.position.y =
            floatAmount;


        /*
         * ==================================
         * HERO CONTENT SCROLL EFFECT
         * ==================================
         */

        const heroContent =
            document.querySelector(
                ".hero-content"
            );


        if (
            heroContent &&
            !prefersReducedMotion
        ) {

            const contentY =
                scroll.current *
                -120;


            const contentOpacity =
                1 -
                (
                    scroll.current *
                    1.25
                );


            heroContent.style.transform =
                `translate3d(
                    0,
                    ${contentY}px,
                    0
                )`;


            heroContent.style.opacity =
                THREE.MathUtils.clamp(
                    contentOpacity,
                    0,
                    1
                );

        }


        /*
         * ==================================
         * 3D CANVAS FADE
         * ==================================
         */

        const canvasOpacity =
            1 -
            (
                scroll.current *
                0.18
            );


        container.style.opacity =
            THREE.MathUtils.clamp(
                canvasOpacity,
                0.82,
                1
            );


        /*
         * ==================================
         * RENDER
         * ==================================
         */

        renderer.render(
            scene,
            camera
        );

    }


    /*
     * ======================================
     * RESIZE
     * ======================================
 */

    function handleResize() {

        const width =
            container.clientWidth;


        const height =
            container.clientHeight;


        if (
            width <= 0 ||
            height <= 0
        ) {
            return;
        }


        camera.aspect =
            width /
            height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height,
            false
        );


        renderer.setPixelRatio(
            Math.min(
                window.devicePixelRatio,
                2
            )
        );


        updateScrollTarget();

    }


    window.addEventListener(
        "resize",
        handleResize,
        {
            passive: true
        }
    );


    /*
     * ======================================
     * INITIAL STATE
     * ======================================
     */

    updateScrollTarget();


    /*
     * ======================================
     * START
     * ======================================
 */

    animate(
        performance.now()
    );


    /*
     * ======================================
     * CLEANUP
     * ======================================
 */

    window.addEventListener(
        "beforeunload",
        () => {

            cancelAnimationFrame(
                animationFrameId
            );


            coreGeometry.dispose();
            coreMaterial.dispose();


            innerGeometry.dispose();
            innerMaterial.dispose();


            ringGeometry.dispose();
            ringMaterial.dispose();


            secondRingGeometry.dispose();


            particleGeometry.dispose();
            particleMaterial.dispose();


            glowGeometry.dispose();
            glowMaterial.dispose();


            renderer.dispose();

        }
    );
}


/*
 * ==========================================
 * ABOUT REVEAL
 * ==========================================
 */

function initAboutReveal() {

    const about =
        document.getElementById(
            "about"
        );


    if (!about) {
        return;
    }


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        prefersReducedMotion
    ) {

        about.classList.add(
            "is-visible"
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            about.classList.add(
                                "is-visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    observer.observe(
        about
    );
}

/*
 * ==========================================
 * STEP 5 — ENGINEERING FLOW REVEAL
 * ==========================================
 */

function initEngineeringFlow() {

    const cards =
        document.querySelectorAll(
            ".flow-card"
        );


    if (!cards.length) {
        return;
    }


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (
        prefersReducedMotion
    ) {

        cards.forEach(
            (card) => {
                card.classList.add(
                    "is-visible"
                );
            }
        );

        return;
    }


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        const card =
                            entry.target;


                        const step =
                            Number(
                                card.dataset.step
                            ) || 1;


                        setTimeout(
                            () => {

                                card.classList.add(
                                    "is-visible"
                                );

                            },
                            step * 120
                        );


                        observer.unobserve(
                            card
                        );

                    }
                );

            },
            {
                threshold:
                    0.18
            }
        );


    cards.forEach(
        (card) => {

            observer.observe(
                card
            );

        }
    );
}