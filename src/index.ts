import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,

    addBasePlugins,
    ITexture, TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin,

    IViewerPlugin,

    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger)


async function setupViewer(){

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
        useRgbm: false
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)
    const camera = viewer.scene.activeCamera
    const position = camera.position
    const target = camera.target

    // Add a popup(in HTML) with download progress when any asset is downloading.
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)

    // or use this to add all main ones at once.
    //await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    //await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    await manager.addFromPath("./assets/stegosaurus6.glb")

    viewer.scene.activeCamera.setCameraOptions({controlsEnabled:false})

    // Load an environment map if not set in the glb file
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );

    function setupScrollAnimation(){
        const mouseImg = document.querySelector(".mouse-img") as HTMLElement
        const customBtn = document.querySelector(".threeD-icon") as HTMLElement
        const sections = document.querySelector('.container') as HTMLElement
        const canvas = document.getElementById('webgi-canvas-container') as HTMLElement
        const exitBtn = document.querySelector('.btn-exit') as HTMLElement
        const headerText = document.querySelector('.heading') as HTMLElement
        const scrollBtn = document.querySelector('.scrolldown-btn') as HTMLElement
        const tl = gsap.timeline()
        tl
        //first section
        //x:1.8,y:0.87,z:1.37
        //x:0.37,y:0.33,z:0.29
        .to(position,{x:2.09,y:2.0,z:1.15,
            scrollTrigger:{
                trigger:".second",start:"top bottom",end:"top top",scrub:1,
                immediateRender:false
            },
            onUpdate
        })
        .to(target,{x:-0.44,y:-0.02,z:0.18,
            scrollTrigger:{
                trigger:".second",start:"top bottom",end:"top top",scrub:1,
                immediateRender:false
            }
        })
        .to(customBtn,{opacity:0,duration:0.5,
            scrollTrigger:{
                trigger:".second",start:"top bottom",end:"top top",scrub:true
            }
        })
        .to(scrollBtn,{opacity:0,duration:0.5,
            scrollTrigger:{
                trigger:".second",start:"top bottom",end:"top top",scrub:true
            }
        })
        //second section
        //x:4.12,y:0.026,z:-0.11
        //x:1.95,y:-0.5,z:-0.25
        .to(position,{x:0.02,y:1.43,z:-1.2,
            scrollTrigger:{
                trigger:".third",start:"top bottom",end:"top top",scrub:1,
                immediateRender:false
            },
            onUpdate
        })
        .to(target,{x:-1.07,y:0.26,z:-0.15,
            scrollTrigger:{
                trigger:".third",start:"top bottom",end:"top top",scrub:1,
                immediateRender:false
            }
        })
        //third section
        //x:4.02,y:0.13,z:1.72
        //x:1.43,y:-0.24,z:0.13
        .to(position,{x:2.79,y:1.01,z:1.2,
            scrollTrigger:{
                trigger:".fourth",start:"top bottom",end:"top top",scrub:1,
                immediateRender:false
            },
            onUpdate
        })
        .to(target,{x:1.01,y:-0.5,z:-0.96,
            scrollTrigger:{
                trigger:".fourth",start:"top bottom",end:"top top",scrub:1,
                immediateRender:false
            }
        })

        const footerBtn = document.querySelector(".btn-footer") as HTMLElement
        footerBtn.addEventListener('click',()=>{
            window.scrollTo({top:0,left:0,behavior:'smooth'})
        })


        customBtn.addEventListener('click',()=>{
            //sections.style.display = "none"
            // viewer.scene.activeCamera.setCameraOptions({controlsEnabled:true})
            // canvas.style.pointerEvents = "all"
            // document.body.style.cursor = "grab"
            // exitBtn.style.display = "block"

            gsap.to(headerText,{y:-200,duration:1})
            gsap.to(customBtn,{x:-200,duration:1})
            gsap.to(scrollBtn,{x:200,duration:1,onComplete:appear})
        })

        const appear = ()=>{
            sections.style.visibility = "hidden"
            viewer.scene.activeCamera.setCameraOptions({controlsEnabled:true})
            canvas.style.pointerEvents = "all"
            document.body.style.cursor = "grab"
            exitBtn.style.display = "block"
            mouseImg.style.display = "block"
        }

        exitBtn.addEventListener('click',()=>{
            sections.style.visibility = "visible"
            viewer.scene.activeCamera.setCameraOptions({controlsEnabled:false})
            canvas.style.pointerEvents = "none"
            document.body.style.cursor = "default"
            exitBtn.style.display = "none"
            mouseImg.style.display = "none"

            gsap.to(headerText,{y:0,duration:1})
            gsap.to(customBtn,{x:0,duration:1})
            gsap.to(scrollBtn,{x:0,duration:1})

            gsap.to(position,{x:1.69,y:0.04,z:4.06,duration:2,ease:"power3,inOut",onUpdate})
            gsap.to(target,{x:-0.14,y:0.12,z:-1.05,duration:2,ease:"power3,inOut",onUpdate})
        })


    }
    setupScrollAnimation()

    let needsUpdate = true;
    // WEBGI update
    function onUpdate(){
        needsUpdate = true
        viewer.renderer.resetShadows()
    }
    viewer.addEventListener('preFrame',()=>{
        if(needsUpdate){
            camera.positionUpdated(true)
            camera.targetUpdated(true)
            needsUpdate = false
        }
    })


}

setupViewer()


//<a href=https://www.pngmart.com/image/324761 target="_blank">3D Logo PNG Photo</a>