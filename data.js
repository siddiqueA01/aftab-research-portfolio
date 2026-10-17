/* Portfolio content is intentionally kept here for easy editing. */
window.PORTFOLIO = {
  projects: [
    {
      id:'cl', title:'The non-invasive disease screening frontier', short:'AI + Bioelectrical Impedance', category:'animal-health', filters:['animal-health','ai-sensing','one-health'], image:'assets/cl.svg', year:'2026', status:'Published', statusType:'published', eyebrow:'CASE STUDY / 01', label:'CASE STUDY',
      summary:'Can electrical tissue properties offer a practical screening signal for caseous lymphadenitis (CL) in goats? This study evaluated multi-frequency bioelectrical impedance with machine-learning models and realistic animal-level validation.',
      metric:'2,673', metricLabel:'BIA measurements', methods:['50 / 100 / 180 kHz bioelectrical impedance','Supervised classification','Five-fold validation and leave-one-subject-out testing','Precision surveillance / One Health'],
      outcomes:['36 Spanish male goats and 2,673 measurements','SVM-RBF reached ROC-AUC 0.851 under five-fold validation','Leave-one-subject-out ROC-AUC was 0.68, underscoring generalization limits'],
      takeaway:'Promising as an adjunct screening approach. It is not a validated replacement for veterinary diagnostics; new-herd, sex-diverse and independent-site validation remains essential.',
      publication:'Smart Agricultural Technology (2026)', href:'https://doi.org/10.1016/j.atech.2026.102548'
    },
    {
      id:'anemia', title:'A drop of blood. A new diagnostic signal.', short:'Smartphone Imaging + Explainable AI', category:'animal-health', filters:['animal-health','ai-sensing','one-health'], image:'assets/anemia.svg', year:'2026', status:'Published', statusType:'published', eyebrow:'CASE STUDY / 02', label:'CASE STUDY',
      summary:'Reagent-free paper-based bloodspot imaging combined with machine learning to explore image-level signatures of anemia across goats, sheep and cattle.',
      metric:'3', metricLabel:'livestock species', methods:['Smartphone photographs of prepared blood spots','Species-aware image preprocessing','Machine-learning classification','Explainability and PCV-linked anemia reference labels'],
      outcomes:['Evaluated goats, sheep and cattle','Highest and most consistent image-level classification performance occurred in sheep','Species-to-species differences showed the importance of validation'],
      takeaway:'Promising as an accessible research pathway, with performance variation across species and a need for prospective field testing.',
      publication:'Scientific Reports (2026)', href:'https://doi.org/10.1038/s41598-026-62774-y'
    },
    {
      id:'rfid', title:'When animal behavior tells the story', short:'RFID + Time-Aware ML', category:'ai-sensing', filters:['animal-health','ai-sensing'], image:'assets/rfid.svg', year:'2026', status:'Published', statusType:'published', eyebrow:'CASE STUDY / 03', label:'CASE STUDY',
      summary:'A temporal model turns RFID-derived goat activity into a richer view of behavior, including latent states, anomaly patterns and near-term forecasting.',
      metric:'85,890', metricLabel:'RFID activity records', methods:['30 Boer goats','Time-aware activity features','Random forest classification and forecasting','Nested time-blocked validation'],
      outcomes:['ROC-AUC 0.869 for five-minute onset prediction','ROC-AUC 0.841 for ten-minute onset prediction','Interactive conceptual decision-support framing'],
      takeaway:'Behavioral forecasting is not the same as diagnosing disease; external biological validation is still required.',
      publication:'Agriculture (2026)', href:'https://doi.org/10.3390/agriculture16141499'
    },
    {
      id:'parasite', title:'Seeing parasite risk through new signals', short:'Haemonchosis + Biosensing', category:'animal-health', filters:['animal-health','one-health','ai-sensing'], image:'assets/parasite.svg', year:'2025', status:'Published', statusType:'published', eyebrow:'CASE STUDY / 04', label:'CASE STUDY',
      summary:'Investigating whether bioelectrical impedance and machine learning can distinguish goats with different levels of exposure to Haemonchus contortus.',
      metric:'94', metricLabel:'Spanish bucks in cohort', methods:['Bioelectrical impedance analysis','Animal-level parasitological context','Machine-learning classification','Non-invasive diagnostic feasibility'],
      outcomes:['Evaluated the feasibility of impedance-based goat classification','Established a foundation for further animal-health sensing research','Demonstrated important real-world diagnostic validation needs'],
      takeaway:'A proof-of-concept investigation. Conventional parasite assessment and veterinary interpretation remain essential.',
      publication:'Frontiers in Veterinary Science (2025)', href:'https://doi.org/10.3389/fvets.2025.1584828'
    },
    {
      id:'wave', title:'Listening to livestock without touching', short:'Radiofrequency Sensing', category:'ai-sensing', filters:['animal-health','ai-sensing'], image:'assets/wave.svg', year:'2025', status:'Published', statusType:'published', eyebrow:'CASE STUDY / 05', label:'CASE STUDY',
      summary:'Investigating radiofrequency-based methods for rapid animal-health monitoring, a potential path toward practical and minimally disruptive sensing.',
      metric:'RF', metricLabel:'non-contact sensing pathway', methods:['Radiofrequency sensing','Feature engineering','Machine-learning analysis','Precision livestock system design'],
      outcomes:['Contributes to research on rapid animal-health monitoring','Links sensing hardware to downstream AI-enabled interpretation'],
      takeaway:'The technology requires careful calibration and validation under farm operating conditions.',
      publication:'Veterinary Sciences (2025)', href:'https://doi.org/10.3390/vetsci12111096'
    },
    {
      id:'digital', title:'The case for digital parasitology', short:'One Health + Precision Control', category:'one-health', filters:['one-health','animal-health','ai-sensing'], image:'assets/digital.svg', year:'2026', status:'Published online', statusType:'published', eyebrow:'PERSPECTIVE / 06', label:'PERSPECTIVE',
      summary:'A scientific perspective on integrating FAMACHA imaging, sensing, geospatial analytics and AI into more targeted, responsible nematode control strategies.',
      metric:'2026', metricLabel:'online publication', methods:['Digital FAMACHA concepts','BIA and radiofrequency biosensing','Behavioral monitoring and WebGIS','Explainable AI and veterinary oversight'],
      outcomes:['Published online 29 September 2026','Frames digital technologies as decision support for targeted selective treatment','Highlights equity, bias, model drift and field-adoption barriers'],
      takeaway:'Digital parasitology should support conventional parasitology and veterinary judgment, not replace them.',
      publication:'Trends in Parasitology (2026)', href:'https://doi.org/10.1016/j.pt.2026.09.004'
    },
    {
      id:'poultry', title:'Understanding poultry meat quality with AI', short:'Poultry + Meat Quality', category:'poultry', filters:['poultry','ai-sensing'], image:'assets/poultry.svg', year:'ONGOING', status:'Research in progress', statusType:'ongoing', eyebrow:'IN THE LAB / 07', label:'ONGOING',
      summary:'Exploring how bioelectrical measurements, imaging and predictive models may support objective identification of woody breast and other poultry meat-quality traits.',
      metric:'R&D', metricLabel:'early-stage model development', methods:['Bioelectrical impedance features','Poultry meat-quality phenotyping','Machine-learning model comparison','Validation-focused analysis'],
      outcomes:['Evaluating signal quality and model generalizability','Method refinement and additional validation are ongoing'],
      takeaway:'Preliminary, unpublished findings; not an established commercial meat-quality classifier.',
      publication:'Research in progress', href:null
    },
    {
      id:'mastitis', title:'Early mastitis signals, hidden in impedance', short:'Dairy Goat Health + AI', category:'animal-health', filters:['animal-health','ai-sensing','one-health'], image:'assets/mastitis.svg', year:'ONGOING', status:'Manuscript in progress', statusType:'ongoing', eyebrow:'IN THE LAB / 08', label:'ONGOING',
      summary:'Developing models to evaluate multi-frequency bioelectrical impedance as an adjunctive signal for mastitis assessment in dairy goats.',
      metric:'R&D', metricLabel:'validation in progress', methods:['Longitudinal animal-health measurements','Multi-frequency impedance sensing','Conventional mastitis indicators','Animal-aware validation of AI models'],
      outcomes:['Pilot research dataset under analysis','Focus on within-animal dependence and out-of-animal generalization'],
      takeaway:'Under development. Internal model metrics should not be equated with prospective diagnostic performance.',
      publication:'Manuscript in preparation / review', href:null
    }
  ],
  publications: [
    {title:'Digital parasitology for small ruminant nematodes', journal:'TRENDS IN PARASITOLOGY', year:'2026', type:'OPINION', href:'https://doi.org/10.1016/j.pt.2026.09.004'},
    {title:'Multi-Frequency Bioelectrical Impedance and Machine Learning for Non-Invasive Detection of Caseous Lymphadenitis in Goats', journal:'SMART AGRICULTURAL TECHNOLOGY', year:'2026', type:'RESEARCH', href:'https://doi.org/10.1016/j.atech.2026.102548'},
    {title:'Blood drop patterns and explainable AI reveal livestock anemia signatures', journal:'SCIENTIFIC REPORTS', year:'2026', type:'RESEARCH', href:'https://doi.org/10.1038/s41598-026-62774-y'},
    {title:'A Time-Aware Machine Learning Framework for Behavioral Anomaly Monitoring and Short-Horizon Forecasting in Goats Using RFID-Derived Activity Data', journal:'AGRICULTURE', year:'2026', type:'RESEARCH', href:'https://doi.org/10.3390/agriculture16141499'},
    {title:'Evaluating the efficacy of bioelectrical impedance analysis using machine learning models for the classification of goats exposed to Haemonchosis', journal:'FRONTIERS IN VETERINARY SCIENCE', year:'2025', type:'RESEARCH', href:'https://doi.org/10.3389/fvets.2025.1584828'},
    {title:'Radiofrequency wave sensing for rapid animal health monitoring', journal:'VETERINARY SCIENCES', year:'2025', type:'RESEARCH', href:'https://doi.org/10.3390/vetsci12111096'}
  ]
};
