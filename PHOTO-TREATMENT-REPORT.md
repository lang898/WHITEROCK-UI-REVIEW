# Owner Photo Treatment Report

This review treats each owner-supplied Vietnam image according to its actual visual strengths. Original files remain untouched. Generated derivatives use descriptive filenames so every treatment can be revised or replaced independently.

| Original | Visual assessment | Treatment decision | Current use |
| --- | --- | --- | --- |
| `factory-01.jpg` | The gate is useful, but overhead wires, the pole, and excess road/sky weaken the frame. | Tight gate crop with lightly muted natural color. | Homepage company story and Factory gallery. |
| `factory-02.jpg` | Strong production depth and distinctive orange cutting equipment. The color helps buyers read the machinery. | Low-saturation close crop centered on the cutting line for the homepage; a wider controlled-color crop remains for factual Factory use. | Homepage capability strip, equipment card, and Factory gallery. |
| `factory-03.jpg` | Useful close process view, but backlight, wet reflections, hoses, and mixed green tones make it visually busy. | Tight monochrome crop centered on the processing machine for the homepage; lightly muted color remains for factual Factory use. | Homepage atmosphere image, equipment card, and Factory gallery. |
| `factory-04.jpg` | Clear vanity-top sequence and visible stone pattern; one of the strongest product-process photos. | Tight product crop with nearly full color, plus a clean vertical sequence crop for the mobile Hero. | Mobile homepage hero, equipment card, and Factory gallery. |
| `factory-05.jpg` | Good production scale and repeated finished tops; wall and lighting are secondary. | Crop toward the finished tops and retain restrained natural color. | Factory gallery. |
| `factory-06.jpg` | Best overall finished-top image, with depth, repetition, and visible product variation, but the wide frame includes workshop clutter. | Dedicated shallow panoramic crop containing only the central finished-top band for the desktop Hero; the wider product crop remains for factual Factory use. | Desktop homepage hero, capability strip, and Factory gallery. |
| `vanity-01.jpg` | Low resolution, but the central aisle, stone racks, and yellow lifting equipment clearly communicate workflow. | Moderate color retention with a small brightness lift; used at smaller display sizes. | Equipment card and Factory gallery. |
| `vanity-02.jpg` | Low resolution, but orange machinery and staged components are easy to identify. | Controlled natural color; used only in gallery scale. | Factory gallery. |
| `vanity-03.jpg` | Low-resolution but useful factory-yard reference with a clear access road and outdoor stone storage. | Full-frame, lightly muted natural color with a small brightness lift; limited to gallery-scale display. | Factory gallery and lookbook data. |
| `vanity-04.jpg` | Useful product staging and rack rhythm, although the background is visually dense. | Lightly muted color and a tighter crop. | Factory gallery. |
| `vanity-05.jpg` | A second entrance reference with distracting wires and excess sky. | Wide gate crop with lightly muted natural color. | About page facility panel. |
| `legacy-production-hall-original.jpg` | Compact but clear view of stone racks, lifting equipment, and the central production aisle from the original website archive. | Retained in restrained natural color and limited to gallery-scale display because of its source resolution. | Factory gallery and project-reference data. |
| `legacy-vanity-qc-wide-original.jpg` | High-value wide production reference with many finished vanity tops, but the left wall and notice boards distract from the product. | Tight 16:9 crop focused on the tops and worktables; color retained for material visibility. | Products page production-reference feature and Factory gallery. |
| `legacy-vanity-qc-line-original.jpg` | Strong repeated sequence of finished tops, with wall notices and surrounding workshop details above the useful area. | Lower close crop centered on veining, sink cutouts, faucet drilling, and edge preparation; color retained. | Homepage capability strip, Factory gallery, and project-reference data. |

## Balance rule

- Finished stone and identifiable equipment retain color.
- Muted color is used where the original lighting or background is uneven.
- Black and white is limited to one tightly cropped homepage machinery treatment of `factory-03.jpg`.
- No derivative is presented as a different facility, project, or piece of equipment.

## Original website archive audit

The archive `WHITEROCK-OPTIMA-complete_1.zip` contained 159 image files representing 80 unique JPG/WebP image groups.

- 61 groups are already present in the current site as the same visual content, including application renders, material and color imagery, edge and finish diagrams, product renders, and the 11 original Vietnam gallery photos.
- Three additional Vietnam owner-photo derivatives were imported and mapped as documented above.
- One alternate Vietnam entrance image was not imported because the current tighter entrance crop is cleaner and comes from the same owner-supplied scene.
- Nine China gallery images and six China factory images were excluded to preserve the current Vietnam-only site scope and avoid reintroducing OPTIMA, Yunfu, or China-factory references.
- Illustrative renders remain labeled as illustrative through their existing data flags. No archive image was reclassified as a real product photograph.

## 2026-08-29 owner-approved image library

The latest delivery contained 19 owner-approved files. Two pairs were exact duplicates, so the site keeps 17 unique images without redundant downloads.

- `07.png` and `18.png` were identical; one edge-polisher image was retained.
- `08.png` and `19.png` were identical; one edge-line operation image was retained.
- All 17 unique images have descriptive filenames and optimized JPG, WebP, and AVIF outputs under `public/assets/owner/enhanced/`.
- Reproducible source masters are stored under `source-assets/owner-enhanced/` and can be regenerated with `npm run images:enhanced -- <source-directory>`.
- The homepage uses a product-focused vanity-top sequence, Products uses the wide vanity production view, About uses the exterior image, and Factory uses the production-hall hero plus the full categorized library.
- Equipment diagrams remain unchanged; the new photographs supplement the broader factory gallery rather than replacing the established line-icon reference system.

## Full-color library rollout

The enhanced owner library now supersedes the earlier muted and monochrome derivatives for public-page photography.

- The homepage Hero uses the full-color CNC cutting line, with a dedicated 720 x 960 mobile crop generated by the same reproducible image workflow.
- Home, About, Applications, Finishes, Lookbook, Projects, and supporting visual components now use full-color files from `public/assets/owner/enhanced/`.
- Factory equipment photography and gallery data have also been remapped to the enhanced set; duplicate gallery entries are removed at render time.
- Earlier `owner/vietnam` photo derivatives remain archived in the repository but are no longer referenced by public image components. The factory-tour video is unchanged.

## Original website countertop and furniture library

The owner-supplied website-source folder was inventoried separately from the factory image library. It contains 245 image files, including 18 exact duplicate groups. The current release deliberately uses only a curated set that supports the confirmed product programs.

- Fifteen selected originals were preserved under `source-assets/owner-countertops/` and converted into optimized JPG, 720/1280 WebP, and 1280 AVIF outputs under `public/assets/owner/countertops/`.
- Ten consistent square-format furniture-table images form the Furniture Tops gallery. The gallery describes fabrication directions and surface applications rather than claiming the pictured furniture as a complete WHITEROCK product catalog.
- Three application images support Kitchen Countertops and Furniture Tops across Products, Home, and Applications.
- Two Carrara quarry images support the factual sourcing story for Carrara White vanity-top material.
- The one-page PDF supplied with the batch is treated only as a furniture-top capability reference. Its embedded Chinese brand is not used, and the PDF is not treated as the complete WHITEROCK product line.
- Derivatives can be regenerated with `npm run images:countertops -- <source-directory>`.

## Official brand assets

- The supplied `WHITEROCK LOGO_R1.png` is preserved under `source-assets/brand/`.
- Neutral-gray full-logo and standalone-mark files are generated for the footer, header, and favicon through `npm run images:brand -- <source-directory>`.
- No temporary or third-party catalog branding is used in the public interface.
