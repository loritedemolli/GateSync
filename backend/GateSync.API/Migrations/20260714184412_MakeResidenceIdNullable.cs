using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GateSync.API.Migrations
{
    /// <inheritdoc />
    public partial class MakeResidenceIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Residents_Residences_ResidenceId",
                table: "Residents");

            migrationBuilder.AlterColumn<int>(
                name: "ResidenceId",
                table: "Residents",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Residents_Residences_ResidenceId",
                table: "Residents",
                column: "ResidenceId",
                principalTable: "Residences",
                principalColumn: "ResidenceId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Residents_Residences_ResidenceId",
                table: "Residents");

            migrationBuilder.AlterColumn<int>(
                name: "ResidenceId",
                table: "Residents",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Residents_Residences_ResidenceId",
                table: "Residents",
                column: "ResidenceId",
                principalTable: "Residences",
                principalColumn: "ResidenceId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
