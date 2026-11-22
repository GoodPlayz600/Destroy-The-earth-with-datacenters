using System;
using UnityEngine;

namespace Clearcut
{
    public sealed class OpeningAudio : MonoBehaviour
    {
        AudioSource effects;
        AudioClip swing, scrape, fall, burn, sale, footstep;
        float nextStep;

        void Awake()
        {
            effects = gameObject.AddComponent<AudioSource>();
            effects.playOnAwake = false;
            var ambience = gameObject.AddComponent<AudioSource>();
            ambience.playOnAwake = false;
            ambience.loop = true;
            ambience.volume = 0.28f;
            ambience.clip = Make("Canopy ambience", 8, (t, n) =>
            {
                float wind = Mathf.Sin(t * Mathf.PI * 0.5f) * 0.05f + 0.10f;
                float birdPhase = t % 2.0f;
                float call = Mathf.Clamp01(1 - Mathf.Abs(birdPhase - 0.39f) * 12);
                return n * wind * 0.4f + Mathf.Sin(t * Mathf.PI * 20) * 0.025f +
                    Mathf.Sin(2 * Mathf.PI * (1330 * t + 56 * Mathf.Sin(t * 17))) * call * 0.045f;
            }, false);
            ambience.Play();

            swing = Make("Plastic swish", 0.17f, (t, n) => n * Mathf.Sin(Mathf.PI * t / 0.17f) * 0.17f);
            scrape = Make("Notch scrape", 0.27f, (t, n) =>
                (n * 0.38f + Mathf.Sin(t * Mathf.PI * 224) * 0.19f) * Mathf.Exp(-t * 15));
            fall = Make("Trunk creak", 0.95f, (t, n) =>
                (Mathf.Sin(t * Mathf.PI * (185 - t * 112)) * 0.28f + n * 0.20f) *
                Mathf.Sin(Mathf.PI * t / 0.95f));
            burn = Make("Fresh flame", 0.8f, (t, n) =>
                n * (0.11f + 0.09f * Mathf.Pow(Mathf.Max(0, Mathf.Sin(t * 123)), 8)) * (1 - t / 0.8f));
            sale = Make("Receipt", 0.48f, (t, n) =>
                (Mathf.Sin(t * Mathf.PI * 1046) + 0.42f * Mathf.Sin(t * Mathf.PI * 1570)) *
                0.22f * Mathf.Exp(-t * 8));
            footstep = Make("Leaf litter step", 0.16f, (t, n) =>
                (n * 0.4f + Mathf.Sin(t * Mathf.PI * 128) * 0.14f) * Mathf.Exp(-t * 20));
        }

        static AudioClip Make(string name, float duration, Func<float, float, float> sample, bool taper = true)
        {
            const int rate = 24000;
            var random = new System.Random(117);
            var samples = new float[Mathf.RoundToInt(duration * rate)];
            float filtered = 0;
            for (int i = 0; i < samples.Length; i++)
            {
                float time = i / (float)rate;
                filtered = filtered * 0.64f + ((float)random.NextDouble() * 2 - 1) * 0.36f;
                float envelope = taper ? Mathf.Min(1, Mathf.Min(time, duration - time) * 110f) : 1;
                samples[i] = sample(time, filtered) * envelope;
            }
            var clip = AudioClip.Create(name, samples.Length, 1, rate, false);
            clip.SetData(samples, 0);
            return clip;
        }

        void Play(AudioClip clip, float volume = 1) => effects.PlayOneShot(clip, volume);
        public void Swing() => Play(swing, 0.75f);
        public void Scrape() => Play(scrape);
        public void Fall() => Play(fall);
        public void Burn() => Play(burn, 0.8f);
        public void Sale() => Play(sale, 0.85f);

        public void Step(float speed, float dt)
        {
            nextStep -= dt * speed;
            if (nextStep > 0)
                return;
            nextStep = 2.25f;
            Play(footstep, 0.58f);
        }
    }
}
