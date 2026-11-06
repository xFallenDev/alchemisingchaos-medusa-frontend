import { Container, clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

import PlaceholderImage from "@modules/common/icons/placeholder-image"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  isFeatured?: boolean
  className?: string
  alt?: string
  framing?: unknown
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  className,
  alt = "",
  framing,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-4 bg-[#e8ede8] rounded-large transition-shadow ease-in-out duration-150 group-hover:shadow-lg",
        className,
        {
          "aspect-[4/5]": size !== "square",
          "aspect-[1/1]": size === "square",
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full",
        }
      )}
      data-testid={dataTestid}
    >
      <ImageOrPlaceholder image={initialImage} size={size} alt={alt} framing={framing} />
    </Container>
  )
}

const ImageOrPlaceholder = ({
  image,
  size,
  alt,
  framing,
}: Pick<ThumbnailProps, "size" | "alt" | "framing"> & { image?: string }) => {
  const value = framing && typeof framing === "object" ? framing as Record<string, unknown> : {}
  const coordinate = (n: unknown) => typeof n === "number" && Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 50
  return image ? (
    <Image
      src={image}
      alt={alt ?? ""}
      className="absolute inset-0 object-cover object-center"
      style={{ objectFit: value.fit === "contain" ? "contain" : "cover", objectPosition: `${coordinate(value.x)}% ${coordinate(value.y)}%` }}
      draggable={false}
      sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
      fill
    />
  ) : (
    <div className="w-full h-full absolute inset-0 flex items-center justify-center">
      <PlaceholderImage size={size === "small" ? 16 : 24} />
    </div>
  )
}

export default Thumbnail
