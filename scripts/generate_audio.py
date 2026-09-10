#!/usr/bin/env python3
"""Generate real MP3 audio for every b1-tracks.js entry using macOS's
built-in `say` (Anna for German, Samantha for English) plus ffmpeg to
concatenate/convert. No API key, no cloud TTS -- runs entirely offline.

Usage (from the flashcard-app/ directory):
    python3 scripts/generate_audio.py                # all tracks
    python3 scripts/generate_audio.py s1-01 s1-02     # just these ids

Requires: macOS (for `say`), ffmpeg on PATH. Output goes to audio/<id>.mp3,
matching the `audio` field already on each track in b1-tracks.js.
"""
import json, subprocess, os, sys, re, tempfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(SCRIPT_DIR)
OUT_DIR = os.path.join(APP_DIR, 'audio')
CLIP_DIR = os.path.join(tempfile.gettempdir(), 'b1_audio_clips')

DE_VOICE = 'Anna'
EN_VOICE = 'Samantha'


def load_tracks():
    """Extract B1_TRACKS from b1-tracks.js via Node (it's a plain JS file,
    not JSON, so this is the simplest reliable way to read it)."""
    b1_tracks_path = os.path.join(APP_DIR, 'b1-tracks.js')
    node_src = open(b1_tracks_path, encoding='utf-8').read() + '\nconsole.log(JSON.stringify(B1_TRACKS));'
    result = subprocess.run(['node', '-e', node_src], capture_output=True, text=True, check=True)
    return json.loads(result.stdout)


clip_counter = [0]


def make_silence(path, seconds):
    subprocess.run(['ffmpeg', '-y', '-f', 'lavfi', '-i', 'anullsrc=r=22050:cl=mono',
                     '-t', str(seconds), path], check=True,
                    stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def clean(text):
    return re.sub(r'\s+', ' ', text).strip()


def say_clip(voice, text, rate=170):
    text = clean(text)
    if not text:
        return None
    clip_counter[0] += 1
    path = os.path.join(CLIP_DIR, 'clip_%05d.aiff' % clip_counter[0])
    subprocess.run(['say', '-v', voice, '-r', str(rate), '-o', path, text], check=True)
    return path


def build_track_script(track, sil_short, sil_long, sil_xlong):
    """Return an ordered list of clip file paths for one track: German
    phrase, pause, English translation, pause, repeat -- matching how the
    Scooter Tracks are meant to be studied (listen, then say it back)."""
    parts = []

    def add_de(text):
        p = say_clip(DE_VOICE, text)
        if p: parts.append(p); parts.append(sil_long)

    def add_en(text):
        p = say_clip(EN_VOICE, text)
        if p: parts.append(p); parts.append(sil_long)

    def add_de_short(text):
        p = say_clip(DE_VOICE, text)
        if p: parts.append(p); parts.append(sil_short)

    add_en(track['title'] + '.')
    if track.get('intro'):
        add_en(track['intro'])
    parts.append(sil_xlong)

    for section in track['sections']:
        heading = section.get('heading')
        stype = section['type']

        if stype in ('phrases', 'builds'):
            if heading: add_en(heading + '.')
            for row in section['rows']:
                add_de(row['de'])
                if row.get('en'): add_en(row['en'])
                parts.append(sil_short)
            parts.append(sil_xlong)

        elif stype == 'dialogue':
            if heading: add_en(heading + '.')
            if section.get('intro'): add_en(section['intro'])
            parts.append(sil_long)
            for line in section['lines']:
                add_de_short(line['de'])
            parts.append(sil_xlong)

        elif stype == 'text':
            if heading: add_en(heading + '.')
            if section.get('intro'): add_en(section['intro'])
            for line in section['lines']:
                add_de_short(line)
            parts.append(sil_xlong)

        elif stype == 'list':
            if heading: add_en(heading + '.')
            for item in section['items']:
                add_de(item)
            parts.append(sil_xlong)

    return parts


def concat_to_mp3(parts, out_path):
    listfile = out_path + '.txt'
    with open(listfile, 'w') as f:
        for p in parts:
            f.write("file '%s'\n" % p)
    subprocess.run(['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', listfile,
                     '-ac', '1', '-ar', '44100', '-b:a', '64k', out_path],
                    check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    os.remove(listfile)


def main():
    os.makedirs(CLIP_DIR, exist_ok=True)
    os.makedirs(OUT_DIR, exist_ok=True)

    sil_short = os.path.join(CLIP_DIR, 'sil_short.aiff')
    sil_long = os.path.join(CLIP_DIR, 'sil_long.aiff')
    sil_xlong = os.path.join(CLIP_DIR, 'sil_xlong.aiff')
    if not os.path.exists(sil_short):
        make_silence(sil_short, 0.5)
        make_silence(sil_long, 1.0)
        make_silence(sil_xlong, 1.8)

    tracks = load_tracks()
    only = sys.argv[1:] if len(sys.argv) > 1 else None

    for track in tracks:
        if only and track['id'] not in only:
            continue
        out_path = os.path.join(OUT_DIR, os.path.basename(track['audio']))
        print('--- %s: %s -> %s' % (track['id'], track['title'], out_path), flush=True)
        parts = build_track_script(track, sil_short, sil_long, sil_xlong)
        concat_to_mp3(parts, out_path)
        print('    done, %d bytes, %d clips' % (os.path.getsize(out_path), len(parts)), flush=True)


if __name__ == '__main__':
    main()
