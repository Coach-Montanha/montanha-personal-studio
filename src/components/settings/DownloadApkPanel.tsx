import { Smartphone, Download, CheckCircle2, Bell, ShieldCheck, ExternalLink, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DIRECT_APK_URL = "https://github.com/Coach-Montanha/montanha-personal-studio/releases/download/latest/app-debug.apk";
const ACTIONS_FALLBACK_URL = "https://github.com/Coach-Montanha/montanha-personal-studio/actions";

export function DownloadApkPanel() {
  const handleDownload = () => {
    window.open(DIRECT_APK_URL, "_blank");
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-primary/20 bg-gradient-to-br from-card to-primary/[0.03]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Smartphone className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Montanha Personal Studio (Android APK)</h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Nova Versão com Push
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Baixe e instale a atualização diretamente no seu celular para receber avisos de check-in e lembretes de aula de 20 minutos com som e vibração na barra de status.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Button
              size="lg"
              onClick={handleDownload}
              className="w-full sm:w-auto font-bold gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
            >
              <Download className="h-4 w-4" />
              Baixar APK Atualizado
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="w-full sm:w-auto text-xs gap-1.5"
            >
              <a href={ACTIONS_FALLBACK_URL} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                Ver no GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold block text-foreground">Avisos de Check-in</span>
              <span className="text-muted-foreground text-[11px]">Notificação instantânea quando o aluno confirmar aula.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Bell className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold block text-foreground">Aviso 20 min antes</span>
              <span className="text-muted-foreground text-[11px]">Alarme com som e vibração mesmo com notebook desligado.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold block text-foreground">Instalação Segura</span>
              <span className="text-muted-foreground text-[11px]">Compilado diretamente pelo GitHub Actions oficial.</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-5 space-y-3 bg-muted/20">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <span>Passo a passo de instalação no seu celular:</span>
        </h4>
        <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside leading-relaxed">
          <li>Toque no botão <strong className="text-foreground">"Baixar APK Atualizado"</strong> acima.</li>
          <li>Quando o download terminar, abra a barra de notificações do celular e toque no arquivo baixado (<code className="text-[11px] bg-muted px-1.5 py-0.5 rounded">app-debug.apk</code>).</li>
          <li>Se o Android perguntar <strong className="text-foreground">"Permitir desta fonte"</strong>, clique em Permitir e confirme a instalação da atualização.</li>
          <li>Ao abrir o app pela primeira vez, aceite a permissão <strong className="text-foreground">"Permitir notificações"</strong>.</li>
        </ol>
      </Card>
    </div>
  );
}
