import React from "react";
import Link from "next/link";
import { AppHeader } from "@/components/common/AppHeader";
import { Footer } from "@/components/common/Footer";
import { BottomNavigation } from "@/components/common/BottomNavigation";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { SANTA_MARIA_INFO } from "@/lib/tse/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre o VOTAÍ SM - Transparência e Metodologia | Resultados Eleitorais",
  description:
    "Conheça o VOTAÍ SM, projeto independente para visualização rápida e transparente dos dados oficiais das Eleições 2026 em Santa Maria/RN.",
};

export default function SobrePage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-light text-stone-900">
      <AppHeader status="BEFORE_COUNTING" statusLabel="TRANSPARÊNCIA" />

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Botão de Retorno */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-dark transition-colors"
        >
          <MaterialIcon name="arrow_back" size={16} />
          <span>Voltar para apuração</span>
        </Link>

        {/* Título Principal */}
        <header className="space-y-2 border-b border-stone-200/80 pb-4">
          <h1 className="font-display text-3xl sm:text-4xl text-brand-dark font-normal">
            Sobre o VOTAÍ SM
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed font-sans">
            Transparência, rapidez e tecnologia a serviço da cidadania em Santa Maria/RN.
          </p>
        </header>

        {/* 1. Objetivo do Produto */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <MaterialIcon name="how_to_vote" size={22} />
            <h2 className="font-sans text-base font-bold text-brand-dark uppercase tracking-wider">
              Objetivo do Projeto
            </h2>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            O <strong>VOTAÍ SM</strong> é uma plataforma digital independente concebida para oferecer aos cidadãos de <strong>Santa Maria, Rio Grande do Norte</strong>, uma experiência moderna, rápida e mobile-first no acompanhamento em tempo real dos resultados oficiais das Eleições Gerais de 2026.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            Focada em simplicidade e usabilidade, a aplicação elimina ruídos visuais, tabelas pesadas e excesso de elementos corporativos, permitindo que qualquer pessoa pelo smartphone entenda imediatamente o percentual de apuração, urnas totalizadas e a votação apurada para Presidente, Governador, Senador, Deputado Federal e Deputado Estadual no município.
          </p>
        </section>

        {/* 2. Origem Oficial dos Dados */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <MaterialIcon name="database" size={22} />
            <h2 className="font-sans text-base font-bold text-brand-dark uppercase tracking-wider">
              Origem dos Dados Eleitorais
            </h2>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            Todos os dados eleitorais apresentados são obtidos <strong>exclusivamente</strong> do ambiente oficial de divulgação de resultados do <strong>Tribunal Superior Eleitoral (TSE)</strong>:
          </p>
          <div className="p-3 bg-surface-light rounded-xl border border-stone-200/70 font-data text-xs text-brand-dark break-all">
            Fonte Oficial:{" "}
            <a
              href="https://resultados.tse.jus.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary underline font-semibold"
            >
              https://resultados.tse.jus.br/
            </a>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Não realizamos scraping em sites de terceiros, não utilizamos APIs não oficiais e não criamos dados fictícios. A aplicação consulta os arquivos JSON oficiais do CDN do TSE, validando e normalizando as informações através de seu backend.
          </p>
        </section>

        {/* 3. Metodologia de Atualização e Cache */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <MaterialIcon name="schedule" size={22} />
            <h2 className="font-sans text-base font-bold text-brand-dark uppercase tracking-wider">
              Metodologia de Atualização
            </h2>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            Para garantir velocidade para milhares de acessos simultâneos sem sobrecarregar a infraestrutura pública do TSE:
          </p>
          <ul className="text-xs sm:text-sm text-stone-600 space-y-2 list-disc list-inside">
            <li>
              <strong>Camada de Cache no Backend:</strong> O backend do VOTAÍ SM atua como intermediário inteligente, consultando o TSE com intervalos configuráveis e armazenando respostas em cache temporário.
            </li>
            <li>
              <strong>Polling Inteligente:</strong> O frontend sincroniza dados em tempo real sem recarregar ou piscar a tela, preservando a posição de leitura e animando alterações de votos.
            </li>
            <li>
              <strong>Resiliência (Stale-While-Revalidate):</strong> Caso ocorra instabilidade momentânea no TSE, a plataforma continua exibindo o último dado oficial íntegro obtido, alertando o usuário sobre o horário da última medição válida.
            </li>
          </ul>
        </section>

        {/* 4. Identificação de Santa Maria/RN */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-subtle space-y-3">
          <div className="flex items-center gap-2 text-brand-primary">
            <MaterialIcon name="location_on" size={22} />
            <h2 className="font-sans text-base font-bold text-brand-dark uppercase tracking-wider">
              Santa Maria / RN
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-data">
            <div className="p-2.5 rounded-xl bg-surface-light border border-stone-200/60">
              <span className="text-stone-400 block text-[10px]">Município</span>
              <strong className="text-brand-dark">{SANTA_MARIA_INFO.name}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-light border border-stone-200/60">
              <span className="text-stone-400 block text-[10px]">Estado</span>
              <strong className="text-brand-dark">{SANTA_MARIA_INFO.state}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-light border border-stone-200/60">
              <span className="text-stone-400 block text-[10px]">Cód. TSE</span>
              <strong className="text-brand-primary font-bold">{SANTA_MARIA_INFO.tseCode}</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-surface-light border border-stone-200/60">
              <span className="text-stone-400 block text-[10px]">Cód. IBGE</span>
              <strong className="text-brand-dark">{SANTA_MARIA_INFO.ibgeCode}</strong>
            </div>
          </div>
        </section>

        {/* 5. Isenção de Vínculo e Responsabilidade */}
        <section className="bg-brand-cream/60 rounded-2xl p-6 border border-brand-primary/20 space-y-2 text-xs sm:text-sm text-brand-dark">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
            <MaterialIcon name="shield" size={18} className="text-brand-primary" />
            <span>Aviso Legal e Institucional</span>
          </div>
          <p className="leading-relaxed">
            O <strong>VOTAÍ SM</strong> é uma iniciativa cívica e tecnológica totalmente independente. Não possui vínculo político-partidário e <strong>não é um aplicativo oficial do Tribunal Superior Eleitoral (TSE)</strong>.
          </p>
          <p className="leading-relaxed text-stone-600">
            A Justiça Eleitoral é a única entidade responsável pela totalização e proclamação oficial dos resultados. O VOTAÍ SM limita-se a organizar e exibir visualmente as informações que o TSE torna públicas.
          </p>
        </section>

        {/* 6. Desenvolvedor e Calangos Marketing */}
        <section className="bg-white rounded-2xl p-6 border border-stone-200/90 shadow-subtle space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <MaterialIcon name="person" size={22} />
            <h2 className="font-sans text-base font-bold text-brand-dark uppercase tracking-wider">
              Desenvolvedor
            </h2>
          </div>
          <p className="text-sm text-stone-600 leading-relaxed">
            Projeto concebido e desenvolvido por <strong>Fábio Gutemberg</strong>, CEO da <strong>Calangos Marketing</strong>, especialista em tecnologia web moderna, design centrado no usuário e arquitetura de dados em tempo real.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="https://instagram.com/calangosmarketing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-brand-primary hover:bg-brand-dark transition-all"
            >
              <MaterialIcon name="instagram" size={16} />
              <span>Calangos Marketing</span>
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNavigation />
    </div>
  );
}

