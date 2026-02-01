'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[var(--background)] transition-colors duration-300">
      {/* Back button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-3 bg-[var(--panel-bg)] border-4 border-[var(--panel-border)] shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all text-[var(--panel-text)] font-bold text-xs uppercase"
        style={{ fontFamily: 'var(--font-pixel)' }}
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="max-w-2xl w-full">
        {/* Title */}
        <h1 className="text-5xl font-bold text-[var(--foreground)] mb-8 text-center" style={{ fontFamily: 'var(--font-pixel)' }}>
          ABOUT US
        </h1>

        {/* Content */}
        <div className="bg-[var(--panel-bg)] border-4 border-[var(--panel-border)] shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] p-8">
          <div className="space-y-6 text-[var(--foreground)]">
            <section>
              <p className="text-lg leading-relaxed">
                This is from the Global Game Jam 2026 ETH Zurich site. We are a passionate team of PhD students from ETH Zurich.
              </p>
            </section>


            <section>
              <h2 className="text-2xl font-bold mb-3 uppercase" style={{ fontFamily: 'var(--font-pixel)' }}>
                The Team
              </h2>
              <p className="text-lg leading-relaxed">
                Desmond Liu (desmondlzy)<br />
                Haoyang Zhou (howyoungz)<br />
                Jeremy Chew (mickey1356)<br />
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 uppercase" style={{ fontFamily: 'var(--font-pixel)' }}>
                Special Thanks
              </h2>
              <p className="text-lg leading-relaxed">
                Co-developed with Antigravity and Claude.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3 uppercase" style={{ fontFamily: 'var(--font-pixel)' }}>
                Licenses
              </h2>
              <div className="space-y-4 text-lg leading-relaxed">
                <p>
                  The game content is licensed under CC-BY-SA.
                </p>
                <p>
                  The source code is released under the LGPL 2.1 license.
                </p>
                <div>
                  <p className="mb-2">
                    We use the SerenityOS Emoji Font, which is distributed under the BSD 2-Clause License:
                  </p>
                  <div className="text-sm font-mono bg-black/10 dark:bg-white/10 p-3 rounded">
                    Copyright (c) 2018-2023, the SerenityOS developers.<br />
                    Copyright (c) 2022-2023, Gegga Thor &lt;xexxa@serenityos.org&gt;<br />
                    All rights reserved.
                  </div>
                </div>
                <div>
                  <p className="mb-2">
                    We use the Press Start 2P Font, licensed under the Open Font License:
                  </p>
                  <div className="text-sm font-mono bg-black/10 dark:bg-white/10 p-3 rounded">
                    Copyright (c) 2012 The Press Start 2P Project Authors (cody@zone38.net)
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </main>
  );
}
