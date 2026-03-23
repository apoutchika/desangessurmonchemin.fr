"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";
import type { Photo } from "@/domain";

interface Props {
  photos: Photo[];
}

export function DayGallery({ photos }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps", // Évite le vide à la fin
    dragFree: true, // Snap pour meilleur contrôle
    loop: false, // Pas de défilement infini
  });
  const galleryRef = useRef<HTMLDivElement>(null);

  // État pour savoir si on peut naviguer
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Mettre à jour l'état de navigation
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // PhotoSwipe
  useEffect(() => {
    if (!galleryRef.current) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryRef.current,
      children: "a",
      pswpModule: () => import("photoswipe"),
      bgOpacity: 0.92,
      spacing: 0.1,
      allowPanToNext: true,
      zoom: true,
      close: true,
      arrowKeys: true,
      returnFocus: true,
      clickToCloseNonZoomable: true,
    });

    // Support vidéos
    lightbox.on("contentLoad", (e: any) => {
      const { content } = e;
      if (content.type === "video") {
        e.preventDefault();

        const video = document.createElement("video");
        video.src = content.data.src || "";
        video.controls = true;
        video.autoplay = false; // Désactivé par défaut
        video.style.maxWidth = "100%";
        video.style.maxHeight = "100%";

        if (content.data.poster) {
          video.poster = content.data.poster;
        }

        // @ts-ignore - PhotoSwipe accepte HTMLVideoElement
        content.element = video;
      }
    });

    // Autoplay uniquement quand la vidéo est affichée
    lightbox.on("contentActivate", (e: any) => {
      const { content } = e;
      if (content.type === "video" && content.element) {
        const video = content.element as HTMLVideoElement;
        video.play().catch(() => {
          // Ignore les erreurs de lecture (ex: interaction utilisateur requise)
        });
      }
    });

    // Pause toutes les vidéos quand on change de slide
    lightbox.on("contentDeactivate", (e: any) => {
      const { content } = e;
      if (content.type === "video" && content.element) {
        const video = content.element as HTMLVideoElement;
        if (!video.paused) {
          video.pause();
        }
      }
    });

    // Pause vidéo quand on ferme le lightbox
    lightbox.on("close", () => {
      const videos = document.querySelectorAll(".pswp video");
      videos.forEach((video: any) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, []);

  // Boutons navigation
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="day-gallery-carousel">
      <div className="day-gallery-carousel__header">
        <span className="day-gallery-carousel__title">
          {photos.length} {photos.length > 1 ? "médias" : "média"}
        </span>
        <div className="day-gallery-carousel__controls">
          <button
            onClick={scrollPrev}
            className="day-gallery-carousel__btn"
            aria-label="Précédent"
            style={{ visibility: canScrollPrev ? "visible" : "hidden" }}
          >
            ‹
          </button>
          <button
            onClick={scrollNext}
            className="day-gallery-carousel__btn"
            aria-label="Suivant"
            style={{ visibility: canScrollNext ? "visible" : "hidden" }}
          >
            ›
          </button>
        </div>
      </div>

      <div className="day-gallery-carousel__viewport" ref={emblaRef}>
        <div className="day-gallery-carousel__container" ref={galleryRef}>
          {photos.map((media, i) => {
            const isVideo = media.isVideo();
            const href = media.src;
            const dataType = isVideo ? "video" : "image";

            return (
              <div key={i} className="day-gallery-carousel__slide">
                <a
                  href={href}
                  data-pswp-type={dataType}
                  data-pswp-width={media.width || 1200}
                  data-pswp-height={media.height || 800}
                  data-pswp-src={media.src}
                  data-pswp-poster={media.poster}
                  target="_blank"
                  rel="noreferrer"
                  className="day-gallery-carousel__item"
                  aria-label={`Voir ${isVideo ? "la vidéo" : "la photo"} : ${media.alt}`}
                >
                  <div className="day-gallery-carousel__thumb">
                    <Image
                      src={isVideo && media.poster ? media.poster : media.src}
                      alt={media.alt}
                      width={200}
                      height={135}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />

                    {isVideo && (
                      <>
                        {/* Overlay play */}
                        <div className="day-gallery-carousel__play-overlay">
                          <div className="day-gallery-carousel__play-btn">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path d="M8 5v14l11-7z" fill="currentColor" />
                            </svg>
                          </div>
                        </div>

                        {/* Durée */}
                        {media.duration && (
                          <div className="day-gallery-carousel__duration">
                            {Math.floor(media.duration / 60)}:
                            {String(Math.round(media.duration % 60)).padStart(
                              2,
                              "0",
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {media.caption && (
                    <div className="day-gallery-carousel__caption">
                      {media.caption}
                    </div>
                  )}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
