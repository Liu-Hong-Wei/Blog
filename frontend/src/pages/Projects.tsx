import MainContentLayout from "../layouts/MainContentLayout";

function Projects() {
    return (
        <MainContentLayout>
            <div className="space-y-4">
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Project 1</h2>
                    <p>Description of Project 1.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Project 2</h2>
                    <p>Description of Project 2.</p>
                </div>
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Project 3</h2>
                    <p>Description of Project 3.</p>
                </div>
            </div>
        </MainContentLayout>
    )
}
export default Projects;