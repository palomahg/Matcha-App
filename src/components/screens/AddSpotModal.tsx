import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchaTag, PriceLevel } from '../../types';
import { TAG_DEFINITIONS } from '../../design-system/theme';
import { SPANISH_CITIES_COORDS } from '../../utils/geo';
import { X, Check, Camera, Sparkles, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const AddSpotModal: React.FC = () => {
  const { isAddSpotOpen, closeAddSpotModal, addSpot, language, t } = useApp();

  const [name, setName] = useState('');
  const [city, setCity] = useState<'Madrid' | 'Barcelona' | 'Valencia' | 'Sevilla' | 'Málaga' | 'Bilbao'>('Madrid');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [priceLevel, setPriceLevel] = useState<PriceLevel>('€€');
  const [instagram, setInstagram] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTags, setSelectedTags] = useState<MatchaTag[]>([
    'ceremonial',
    'matcha_latte',
    'vegan_milks',
  ]);
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80'
  );
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isAddSpotOpen) return null;

  const toggleTag = (tag: MatchaTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) return;

    addSpot({
      name: name.trim(),
      city,
      address: address.trim(),
      neighborhood: neighborhood.trim() || 'Centro',
      postalCode: postalCode.trim() || '28001',
      tagline: tagline.trim() || 'Templo de té matcha ceremonial',
      description:
        description.trim() ||
        'Un nuevo rincón acogedor en España recomendado por la comunidad de MatchApp.',
      priceLevel,
      instagram: instagram.trim() ? (instagram.startsWith('@') ? instagram : `@${instagram}`) : undefined,
      phone: phone.trim() || '+34 910 00 00 00',
      tags: selectedTags,
      photos: [photoUrl],
    });

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#A8B98A', '#4F6340', '#E8C9C0', '#D9B25F'],
      });
    } catch (err) {}

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      closeAddSpotModal();
    }, 2800);
  };

  const samplePhotos = [
    'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1515823662273-ad92a691c4d0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#FFFDF8] w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-[#E9DFCB] shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#E9DFCB] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#4F6340]">
              {t.addSpotTitle}
            </h2>
            <p className="text-[11px] text-[#4F6340]/70">
              {t.addSpotSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={closeAddSpotModal}
            className="w-8 h-8 rounded-full bg-[#F6F1E7] text-[#4F6340] hover:bg-[#E9DFCB] flex items-center justify-center transition-colors"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body or Success State */}
        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-[#A8B98A]/20 text-[#4F6340] flex items-center justify-center mx-auto">
              <ShieldCheck size={36} className="text-[#A8B98A]" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#4F6340]">
              {t.spotSubmittedSuccess}
            </h3>
            <p className="text-xs text-[#4F6340]/80 leading-relaxed max-w-xs mx-auto">
              {t.spotSubmittedNotice}
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-[#F6F1E7] text-[#4F6340] text-xs font-semibold border border-[#E9DFCB]">
              {language === 'es' ? 'Estado: En cola de moderación' : 'Status: Moderation Queue'}
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
            {/* Spot Name */}
            <div>
              <label className="block font-semibold text-[#4F6340] mb-1">
                {t.spotNameLabel} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej: HanSo Café Malasaña"
                className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none focus:border-[#4F6340]"
              />
            </div>

            {/* City & Neighborhood */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-[#4F6340] mb-1">
                  {t.spotCityLabel} *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none font-medium"
                >
                  {Object.keys(SPANISH_CITIES_COORDS).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#4F6340] mb-1">
                  {t.spotNeighborhoodLabel}
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="ej: Malasaña / Eixample"
                  className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none"
                />
              </div>
            </div>

            {/* Full Address & Postal Code */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block font-semibold text-[#4F6340] mb-1">
                  {t.spotAddressLabel} *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Calle o Avenida, número"
                  className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4F6340] mb-1">
                  {t.spotPostalCode}
                </label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="28001"
                  className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none"
                />
              </div>
            </div>

            {/* Price Level */}
            <div>
              <label className="block font-semibold text-[#4F6340] mb-1">
                {t.spotPriceLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['€', '€€', '€€€'] as PriceLevel[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriceLevel(p)}
                    className={`py-2 rounded-xl font-bold border transition-colors ${
                      priceLevel === p
                        ? 'bg-[#4F6340] text-[#FFFDF8] border-[#4F6340]'
                        : 'bg-[#F6F1E7] text-[#4F6340] border-[#E9DFCB]'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Instagram & Phone */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-[#4F6340] mb-1">
                  {t.spotInstagramLabel}
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@matchaspot"
                  className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#4F6340] mb-1">
                  {t.spotPhoneLabel}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+34 912 34 56 78"
                  className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none"
                />
              </div>
            </div>

            {/* Tags Selection */}
            <div>
              <label className="block font-semibold text-[#4F6340] mb-1.5">
                {t.spotTagsLabel}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    'ceremonial',
                    'matcha_latte',
                    'iced_matcha',
                    'vegan_milks',
                    'desserts',
                    'takeaway',
                    'aesthetic',
                    'pet_friendly',
                    'wifi_work',
                    'terrace',
                  ] as MatchaTag[]
                ).map((tagKey) => {
                  const def = TAG_DEFINITIONS[tagKey];
                  const isSelected = selectedTags.includes(tagKey);
                  return (
                    <button
                      key={tagKey}
                      type="button"
                      onClick={() => toggleTag(tagKey)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${
                        isSelected
                          ? 'bg-[#4F6340] text-[#FFFDF8] border-[#4F6340]'
                          : 'bg-[#F6F1E7] text-[#4F6340] border-[#E9DFCB]'
                      }`}
                    >
                      <span>{def.emoji}</span>
                      <span>{language === 'es' ? def.labelEs : def.labelEn}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Selection */}
            <div>
              <label className="block font-semibold text-[#4F6340] mb-1">
                {t.spotPhotoUrlLabel}
              </label>
              <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
                {samplePhotos.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPhotoUrl(url)}
                    className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      photoUrl === url
                        ? 'border-[#4F6340] scale-105'
                        : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 bg-[#F6F1E7] border border-[#E9DFCB] rounded-xl text-[#4F6340] outline-none text-[11px]"
              />
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                id="submit-new-spot-btn"
                className="w-full py-3 bg-[#4F6340] hover:bg-[#3C4D30] text-[#FFFDF8] rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Check size={16} />
                <span>{t.submitSpotForApproval}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
