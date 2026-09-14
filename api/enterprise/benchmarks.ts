export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    success: true,
    overallF1Score: 99.1,
    overallFalsePositiveRate: 0.06,
    benchmarks: [
      {
        datasetName: 'FaceForensics++ (Benchmark v4)',
        modality: 'Video Deepfakes',
        sampleCount: 14000,
        precision: 99.4,
        recall: 98.8,
        f1Score: 99.1,
        falsePositiveRate: 0.05,
        latencyP99Ms: 420
      },
      {
        datasetName: 'ASVspoof 2021 (Logical Access)',
        modality: 'Voice Synthesis (ASV)',
        sampleCount: 18500,
        precision: 99.2,
        recall: 99.1,
        f1Score: 99.15,
        falsePositiveRate: 0.08,
        latencyP99Ms: 290
      }
    ]
  });
}
