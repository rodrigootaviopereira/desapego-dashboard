import { HardHat } from 'lucide-react'

export default function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] animate-fade-in">
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
        <HardHat className="w-12 h-12" />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        Em Breve
      </h1>
      <p className="text-muted-foreground max-w-md text-center text-lg">
        Esta seção está em desenvolvimento pelos agentes do Desapego Squad.
        Volte mais tarde para novidades!
      </p>
    </div>
  )
}
