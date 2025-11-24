"use client"

interface ButtonLinkProps {
    button: {
        id: string
        type: string
        label: string
        value: string
        icon?: string | null
    }
    theme: {
        buttonColor: string
        buttonTextColor: string
    }
}

export function ButtonLink({ button, theme }: ButtonLinkProps) {
    const handleClick = async () => {
        try {
            // Track click
            await fetch("/api/track/click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ buttonId: button.id }),
            })
        } catch (err) {
            console.error("Failed to track click:", err)
        }

        // Handle button action based on type
        const value = button.value

        switch (button.type) {
            case "URL":
                window.open(value.startsWith('http') ? value : `https://${value}`, "_blank")
                break
            case "WHATSAPP":
                window.open(`https://wa.me/${value.replace(/[^0-9]/g, '')}`, "_blank")
                break
            case "CALL":
                window.location.href = `tel:${value}`
                break
            case "EMAIL":
                window.location.href = value.includes('@') ? `mailto:${value}` : value
                break
            case "INSTAGRAM":
                window.open(`https://instagram.com/${value.replace('@', '')}`, "_blank")
                break
            case "FACEBOOK":
                window.open(`https://facebook.com/${value}`, "_blank")
                break
            case "TWITTER":
                window.open(`https://twitter.com/${value.replace('@', '')}`, "_blank")
                break
            case "LINKEDIN":
                window.open(`https://linkedin.com/in/${value}`, "_blank")
                break
            case "TIKTOK":
                window.open(`https://tiktok.com/@${value.replace('@', '')}`, "_blank")
                break
            case "YOUTUBE":
                window.open(`https://youtube.com/${value.startsWith('@') ? value : `@${value}`}`, "_blank")
                break
            default:
                window.open(value, "_blank")
        }
    }

    return (
        <button
            onClick={handleClick}
            className="w-full py-3 px-4 rounded-lg font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
            }}
        >
            {button.icon && <span className="mr-2">{button.icon}</span>}
            {button.label}
        </button>
    )
}
