-- CreateTable
CREATE TABLE "AiExplainFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "toolId" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "question" TEXT,
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiExplainFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiExplainFeedback_userId_idx" ON "AiExplainFeedback"("userId");

-- CreateIndex
CREATE INDEX "AiExplainFeedback_toolId_idx" ON "AiExplainFeedback"("toolId");

-- CreateIndex
CREATE INDEX "AiExplainFeedback_createdAt_idx" ON "AiExplainFeedback"("createdAt");

-- AddForeignKey
ALTER TABLE "AiExplainFeedback" ADD CONSTRAINT "AiExplainFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
