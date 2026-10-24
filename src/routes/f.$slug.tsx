import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useState } from "react";
import { getStudioFormBySlugOrId, formatGoogleFormEmbedUrl } from "@/lib/forms-store";
import { Sparkles, ExternalLink, Share2, Check, ArrowLeft, RefreshCw, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export const Route = createFileRoute("/f/$slug")({
  component: PublicFormViewPage,
});

function PublicFormViewPage() {
  const { slug } = Route.useParams();
  const form = getStudioFormBySlugOrId(slug);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const { theme, toggleTheme } = useTheme();

  if (!form) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 text-center">
        <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center mb-4 text-muted-foreground">
          <Dumbbell className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Formulário não encontrado</h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-md">
          O link que você tentou acessar não existe ou foi removido pelo Studio.
        </p>
        <Button asChild variant="outline" className="mt-6 gap-2">
          <Link to="/auth">
            <ArrowLeft className="h-4 w-4" />
            Ir para a página inicial
          </Link>
        </Button>
      </div>
    );
  }

  const embedUrl = formatGoogleFormEmbedUrl(form.googleFormUrl);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${form.title} — Montanha Personal Studio`,
          text: `Preencha o formulário: ${form.title}`,
          url: currentUrl,
        });
      } else {
        await navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        toast.success("Link copiado para a área de transferência!");
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // cancelado ou erro silencioso
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-background text-foreground overflow-hidden font-sans">
      {/* Top Brand Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-border bg-card/85 backdrop-blur-md px-4 py-2.5 pt-[calc(0.625rem+var(--safe-area-inset-top,0px))] flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-tight text-foreground truncate">
                Montanha Personal Studio
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary uppercase">
                <Sparkles className="h-2.5 w-2.5" />
                {form.badge || "Formulário Oficial"}
              </span>
            </div>
            <h1 className="text-xs sm:text-sm font-semibold text-muted-foreground truncate">
              {form.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 px-2.5 text-xs font-medium gap-1.5"
            title="Compartilhar ou copiar link"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Share2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copiado!" : "Compartilhar"}</span>
          </Button>

          <button
            onClick={toggleTheme}
            className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            title="Alternar tema claro/escuro"
            aria-label="Alternar tema"
          >
            {theme === "dark" ? <Sun className="h-4 w-4 text-state-pending" /> : <Moon className="h-4 w-4" />}
          </button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-2 text-xs"
            title="Abrir no Google Forms externo se preferir"
          >
            <a href={form.googleFormUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </header>

      {/* Embedded Responsive Container */}
      <main className="relative flex-1 w-full h-[calc(100dvh-3.5rem-var(--safe-area-inset-top,0px)-var(--safe-area-inset-bottom,0px))] bg-muted/30 pb-[var(--safe-area-inset-bottom,0px)] overflow-hidden">
        {loading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/80 backdrop-blur-[2px]">
            <RefreshCw className="h-7 w-7 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground font-semibold">
              Carregando formulário seguro...
            </p>
          </div>
        )}
        <iframe
          src={embedUrl}
          title={form.title}
          onLoad={() => setLoading(false)}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      </main>
    </div>
  );
}
