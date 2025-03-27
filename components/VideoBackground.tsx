interface VideoBackgroundProps {
    className?: string;
    style?: React.CSSProperties;
}

export default function VideoBackground({ className = "", style = {} }: VideoBackgroundProps) { 
    return (
        <video
          autoPlay
          muted
          loop
          playsInline
          className={className}
          style={{ ...style }}
        >
          <source src="/sky.mp4" type="video/mp4" />
        </video>
    )
}