import React from 'react';
import { BookOpen, Check, Heart, HelpCircle, ShieldCheck, UserCheck } from 'lucide-react';

interface ParentsGuideProps {
  onClose: () => void;
}

export const ParentsGuide: React.FC<ParentsGuideProps> = ({ onClose }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Teacher note card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 flex items-center justify-center text-2xl">
            📋
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
              Comunicado Escolar Oficial
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
              Evaluación de Matemática: 10 de Noviembre
            </h2>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-2 mb-6">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            Nota de la Profesora Sandra del C. Pérez P.:
          </p>
          <p className="italic bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            "Recordar que las evaluaciones están siendo leídas en forma autónoma por los niños/as. Agradezco de antemano su constante compromiso y valioso apoyo desde el hogar."
          </p>
        </div>

        {/* 6 Core Curriculum Points Breakdown */}
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
          ¿Cómo apoyar a tu hijo/a de 7 años en cada contenido?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-900/60 border border-amber-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-300 flex items-center gap-2">
              <span>🎙️ 1. Dictado hasta el 30</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Practiquen diciendo números al azar entre 0 y 30. Pídele que lo escriba en un papel o usando el teclado táctil de esta app con el botón de voz.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-900/60 border border-sky-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-sky-900 dark:text-sky-300 flex items-center gap-2">
              <span>🧩 2. Patrones y Secuencias</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Refuercen contar de 1 en 1, de 2 en 2 (4, 6, 8, 10...) y hacia atrás (20, 19, 18...). También patrones con figuras o colores.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-slate-900/60 border border-emerald-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <span>🧱 3. Unidades y Decenas</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Recordar que 1 Decena es un paquete cerrado de 10 unidades. 2 Decenas y 4 Unidades forman el 24. Los bloques visuales de la app ayudan a concretar este paso.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-slate-900/60 border border-rose-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <span>🍎 4. Conteo de Números</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              En colecciones de más de 15 elementos, enseñarle a marcar o apartar lo que ya contó para no contar dos veces. El juego de conteo de la app incluye este apoyo táctil.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-slate-900/60 border border-indigo-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-2">
              <span>📊 5. Orden Mayor a Menor y Viceversa</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Fijarse primero en las decenas: si un número tiene 2 decenas (23) siempre es mayor que uno con 1 decena (19). Para los signos `&gt;` y `&lt;`, usar la regla del cocodrilo glotón.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-slate-900/60 border border-violet-200 dark:border-slate-700">
            <h4 className="text-sm font-bold text-violet-900 dark:text-violet-300 flex items-center gap-2">
              <span>💡 6. Resolución de Problemas</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              Dado que la prueba se lee de forma autónoma, practicar que el niño lea en voz alta la historia e identifique las palabras clave: "regaló/juntó" ➔ Sumar (+), "comió/perdió" ➔ Restar (-).
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="text-center pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl text-xs hover:bg-slate-800 shadow-sm"
          >
            Entendido, ¡A Practicar!
          </button>
        </div>
      </div>
    </div>
  );
};
